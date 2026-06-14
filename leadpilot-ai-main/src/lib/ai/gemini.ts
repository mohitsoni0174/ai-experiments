/**
 * Gemini AI Integration for LeadPilot AI
 * Handles AI responses, intent detection, and lead qualification
 */

import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai";

let client: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (client) return client;

  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GOOGLE_GEMINI_API_KEY");
  }

  client = new GoogleGenerativeAI(apiKey);
  return client;
}

export interface IntentDetectionResult {
  intent: "lead" | "pricing" | "booking" | "support" | "complaint";
  leadScore: number;
  confidence: number;
  suggestedQuestions: string[];
}

export interface AIResponse {
  response: string;
  intent: "lead" | "pricing" | "booking" | "support" | "complaint";
  leadScore: number;
  suggestedQuestions: string[];
}

const SYSTEM_PROMPT = `You are LeadPilot AI, an intelligent sales assistant for lead qualification.

Your responsibilities:
1. Detect the customer's intent from their message
2. Calculate a lead score (0-100) based on intent and engagement
3. Ask smart qualifying questions when appropriate
4. Provide helpful, professional responses

INTENT TYPES:
- lead: Customer is interested in your product/service (high priority)
- pricing: Customer asking about pricing or plans
- booking: Customer wants to schedule a demo or meeting
- support: Customer needs help or has questions
- complaint: Customer is unhappy or reporting an issue

LEAD SCORING RULES:
- "lead" intent: base 60, +10 if mentions budget/timeline, +10 if mentions company
- "pricing" intent: base 40, +15 if asking comparison
- "booking" intent: base 50, +20 if time mentioned
- "support" intent: base 20
- "complaint" intent: base 5

IMPORTANT: If the user asks about services, features, or what you offer (e.g. "What services do you offer?", "What can you do?", "What features are available?"), always answer with a clear, concise list of the main services and features LeadPilot AI provides. Do NOT reply with generic fallback lines. Example answer:
"We offer AI-powered chat, real-time lead qualification, analytics, secure messaging, and seamless integration for your business."

Never repeat the line "I appreciate your interest! Could you tell me more about what you're looking for?" unless the user is completely unclear.

Always respond in a professional, helpful manner. When high intent is detected, ask qualifying questions like:
- "What's your timeline for implementation?"
- "What's your budget range?"
- "Which features are most important to you?"
- "Are you the decision maker?"
- "What problems are you trying to solve?"

Format your response as JSON:
{
  "response": "Your conversational response here",
  "intent": "one of the intent types",
  "leadScore": number,
  "suggestedQuestions": ["question1", "question2", "question3"]
}`;

export async function generateAIResponse(
  userMessage: string,
  conversationHistory: { role: string; content: string }[] = []
): Promise<AIResponse> {
  try {
    const model: GenerativeModel = getClient().getGenerativeModel({ model: "gemini-1.5-flash" });

    // Build conversation for context
    const messages = [
      ...conversationHistory.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
      {
        role: "user",
        parts: [{ text: userMessage }],
      },
    ];

    const result = await model.generateContent({
      contents: messages,
      systemInstruction: SYSTEM_PROMPT,
    });

    const responseText =
      result.response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // Fallback if JSON parsing fails
      return {
        response: responseText,
        intent: "support",
        leadScore: 30,
        suggestedQuestions: [
          "How can I help you?",
          "What features are you interested in?",
          "When would you like to get started?",
        ],
      };
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      response: parsed.response || responseText,
      intent: parsed.intent || "support",
      leadScore: Math.min(100, Math.max(0, parsed.leadScore || 30)),
      suggestedQuestions: parsed.suggestedQuestions || [],
    };
  } catch (error) {
    console.error("Gemini API Error:", error);

    // Fallback response
    return {
      response:
        "I appreciate your interest! Could you tell me more about what you're looking for?",
      intent: "support",
      leadScore: 25,
      suggestedQuestions: [
        "What's your main use case?",
        "What timeline are you working with?",
        "What features matter most to you?",
      ],
    };
  }
}

export async function detectIntent(
  message: string,
  conversationHistory: { role: string; content: string }[] = []
): Promise<IntentDetectionResult> {
  const response = await generateAIResponse(message, conversationHistory);

  return {
    intent: response.intent,
    leadScore: response.leadScore,
    confidence: 0.9, // Gemini confidence level (can be enhanced with additional processing)
    suggestedQuestions: response.suggestedQuestions,
  };
}
