// Simple local FAQ chatbot for fallback mode (no external AI)

export type Intent = 'support' | 'pricing' | 'booking' | 'complaint' | 'lead';

interface FAQ {
  keywords: string[];
  intent: Intent;
  answer: string;
  suggestions?: string[];
}

const faqs: FAQ[] = [
  {
    keywords: ['price', 'pricing', 'cost', 'plan', 'subscription'],
    intent: 'pricing',
    answer: 'Our plans start at $29/month. We offer flexible pricing for teams of all sizes. Would you like a detailed quote or a demo?',
    suggestions: ['Can I get a custom quote?', 'What features are included in each plan?', 'How do I upgrade?'],
  },
  {
    keywords: ['book', 'demo', 'meeting', 'schedule', 'call'],
    intent: 'booking',
    answer: 'You can book a live demo with our team at your convenience. What date and time work best for you?',
    suggestions: ['Book a demo', 'Show me available times', 'Can I invite my team?'],
  },
  {
    keywords: ['support', 'help', 'issue', 'problem', 'trouble', 'error'],
    intent: 'support',
    answer: 'We’re here to help! Please describe your issue and our support team will assist you as soon as possible.',
    suggestions: ['How do I reset my password?', 'How do I contact support?', 'Where is the documentation?'],
  },
  {
    keywords: ['complaint', 'bad', 'angry', 'unhappy', 'not working', 'refund'],
    intent: 'complaint',
    answer: 'We’re sorry to hear that. Please tell us more about your experience so we can resolve it quickly.',
    suggestions: ['Request a refund', 'Report a bug', 'Contact a manager'],
  },
  {
    keywords: ['lead', 'interested', 'buy', 'purchase', 'trial', 'signup', 'register'],
    intent: 'lead',
    answer: 'Thank you for your interest! Would you like to start a free trial or speak with our sales team?',
    suggestions: ['Start free trial', 'Contact sales', 'See customer stories'],
  },
  {
    keywords: ['service', 'feature', 'offer', 'capability', 'functionality'],
    intent: 'support',
    answer: 'LeadPilot AI offers AI-powered chat, real-time lead qualification, analytics, secure messaging, and seamless integration for your business.',
    suggestions: ['How does lead qualification work?', 'Is my data secure?', 'Can I integrate with my CRM?'],
  },
];

const defaultResponse = {
  response: "I'm here to help! Could you tell me more about your question?",
  intent: 'support' as Intent,
  leadScore: 20,
  suggestedQuestions: [
    'What are you looking to achieve?',
    'Do you have a timeline?',
    'Which features matter most?',
  ],
};

export function mockBotReply(
  userMessage: string,
  conversationHistory: { role: string; content: string }[] = []
) {
  const text = userMessage.toLowerCase();
  for (const faq of faqs) {
    if (faq.keywords.some((kw) => text.includes(kw))) {
      return {
        response: faq.answer,
        intent: faq.intent,
        leadScore: faq.intent === 'lead' ? 60 : faq.intent === 'pricing' ? 40 : faq.intent === 'booking' ? 50 : faq.intent === 'support' ? 20 : 5,
        suggestedQuestions: faq.suggestions || defaultResponse.suggestedQuestions,
      };
    }
  }
  return defaultResponse;
}
