/**
 * AI Provider Factory for LeadPilot AI
 * Allows switching between Gemini and Groq based on environment
 */

import * as gemini from "./gemini";
import * as groq from "./groq";

export type AIProvider = "gemini" | "groq";
export type Intent = "lead" | "pricing" | "booking" | "support" | "complaint";

export interface AIResponse {
  response: string;
  intent: Intent;
  leadScore: number;
  suggestedQuestions: string[];
}

export interface IntentDetectionResult {
  intent: Intent;
  leadScore: number;
  confidence: number;
  suggestedQuestions: string[];
}

class AIProviderFactory {
  private provider: AIProvider;

  constructor() {
    // Determine which provider to use
    if (process.env.GOOGLE_GEMINI_API_KEY) {
      this.provider = "gemini";
    } else if (process.env.GROQ_API_KEY) {
      this.provider = "groq";
    } else {
      // No keys: fall back to mock to avoid UI breakage
      this.provider = "gemini";
    }
  }

  async generateAIResponse(
    userMessage: string,
    conversationHistory: { role: string; content: string }[] = []
  ): Promise<AIResponse> {
    try {
      if (this.provider === "groq") {
        return groq.generateAIResponse(userMessage, conversationHistory);
      }
      if (process.env.GOOGLE_GEMINI_API_KEY) {
        return gemini.generateAIResponse(userMessage, conversationHistory);
      }
      // Fallback mock when no keys
      return Promise.resolve({
        response: "I’m here to help! (mock AI response)",
        intent: "support",
        leadScore: 25,
        suggestedQuestions: [
          "What are you looking to achieve?",
          "Do you have a timeline?",
          "Which features matter most?",
        ],
      });
    } catch (error) {
      console.error("AI provider error, using mock:", error);
      return {
        response: "I’m here to help! (mock AI response)",
        intent: "support",
        leadScore: 25,
        suggestedQuestions: [
          "What are you looking to achieve?",
          "Do you have a timeline?",
          "Which features matter most?",
        ],
      };
    }
  }

  async detectIntent(
    message: string,
    conversationHistory: { role: string; content: string }[] = []
  ): Promise<IntentDetectionResult> {
    try {
      if (this.provider === "groq") {
        return groq.detectIntent(message, conversationHistory);
      }
      if (process.env.GOOGLE_GEMINI_API_KEY) {
        return gemini.detectIntent(message, conversationHistory);
      }
      // Fallback mock intent
      return {
        intent: "support",
        leadScore: 25,
        confidence: 0.5,
        suggestedQuestions: [
          "What are you looking to achieve?",
          "Do you have a timeline?",
          "Which features matter most?",
        ],
      };
    } catch (error) {
      console.error("AI intent error, using mock:", error);
      return {
        intent: "support",
        leadScore: 25,
        confidence: 0.5,
        suggestedQuestions: [
          "What are you looking to achieve?",
          "Do you have a timeline?",
          "Which features matter most?",
        ],
      };
    }
  }

  getProvider(): AIProvider {
    return this.provider;
  }
}

// Singleton instance
export const aiFactory = new AIProviderFactory();

// Export convenience functions
export async function generateAIResponse(
  userMessage: string,
  conversationHistory: { role: string; content: string }[] = []
): Promise<AIResponse> {
  return aiFactory.generateAIResponse(userMessage, conversationHistory);
}

export async function detectIntent(
  message: string,
  conversationHistory: { role: string; content: string }[] = []
): Promise<IntentDetectionResult> {
  return aiFactory.detectIntent(message, conversationHistory);
}

export function getCurrentProvider(): AIProvider {
  return aiFactory.getProvider();
}
