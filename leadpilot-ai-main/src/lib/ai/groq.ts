/**
 * Groq AI Integration for LeadPilot AI (Alternative to Gemini)
 * Faster LLM inference for real-time lead qualification
 */

import Groq, { type Groq as GroqClient } from "groq-sdk";

let client: GroqClient | null = null;

function getClient(): GroqClient {
  if (client) return client;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing GROQ_API_KEY. Set it in .env.local or choose Gemini by setting GOOGLE_GEMINI_API_KEY."
    );
  }

  client = new Groq({ apiKey });
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

Always respond in a professional, helpful manner. When high intent is detected, ask qualifying questions.

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
    // Build message array with system prompt first
    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...conversationHistory.map((msg) => ({
        role: (msg.role === "assistant" ? "assistant" : "user") as
          | "user"
          | "assistant",
        content: msg.content,
      })),
      {
        role: "user" as const,
        content: userMessage,
      },
    ];

    const groq = getClient();

    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768", // Fast, capable model on Groq
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const responseText = response.choices[0]?.message?.content || "";

    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
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
    console.error("Groq API Error:", error);

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
    confidence: 0.85,
    suggestedQuestions: response.suggestedQuestions,
  };
}
