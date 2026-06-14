// ENFORCEMENT PROMPT:
// In src/app/api/chat/message/route.ts, ensure API always returns valid JSON { reply: string } with status 200. If provider fails, return { reply: 'Sorry, I am having trouble right now. Please try again.' } with status 200 instead of throwing.
// ENFORCEMENT PROMPT:
// In src/app/api/chat/message/route.ts, enforce response format: always return structured output in 3 parts: title, bullets[], cta. If model returns plain text, auto-convert it into this format by extracting first line as title, bullet lines as bullets, and last question as CTA.
import { NextRequest, NextResponse } from 'next/server'
import { generateAIResponse, detectIntent } from '@/lib/ai'
import { mockBotReply } from '@/lib/mockBot'
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

async function ensureConversation(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  conversationId?: string,
  sessionId?: string
): Promise<string> {
  if (conversationId) {
    const { data, error } = await supabaseAdmin
      .from('conversations')
      .select('id')
      .eq('id', conversationId)
      .limit(1)

    if (error) throw error

    if (data?.[0]?.id) return data[0].id
  }

  const { data, error } = await supabaseAdmin
    .from('conversations')
    .insert([
      {
        session_id: sessionId || 'web',
        status: 'active',
      },
    ])
    .select('id')
    .single()

  if (error || !data?.id) {
    throw new Error('Failed to create conversation')
  }

  return data.id
}

async function saveMessage(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  conversationId: string,
  role: 'user' | 'assistant',
  content: string,
  intent: string,
  leadScore: number
) {
  const { error } = await supabaseAdmin.from('messages').insert([
    {
      conversation_id: conversationId,
      role,
      content,
      intent,
      lead_score: leadScore,
    },
  ])

  if (error) throw error
}

async function upsertLead(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  conversationId: string,
  leadScore: number,
  intent: string,
  contact?: {
    email?: string
    name?: string
    company?: string
    phone?: string
  }
) {
  const { data: existing, error: existingError } = await supabaseAdmin
    .from('leads')
    .select('id')
    .eq('conversation_id', conversationId)
    .limit(1)

  if (existingError) throw existingError

  if (existing?.[0]?.id) {
    await supabaseAdmin
      .from('leads')
      .update({
        lead_score: leadScore,
        intent,
        updated_at: new Date().toISOString(),
        ...contact,
      })
      .eq('id', existing[0].id)
  } else {
    await supabaseAdmin.from('leads').insert([
      {
        conversation_id: conversationId,
        lead_score: leadScore,
        intent,
        status: 'new',
        ...contact,
      },
    ])
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabaseEnabled = isSupabaseConfigured();
    const {
      message,
      conversationId,
      messages,
      sessionId,
      email,
      name,
      company,
      phone,
    } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Build full conversation history including the latest user message
    const conversationHistory = [
      ...((messages || []).map((msg: any) => ({
        role: msg.role || 'user',
        content: msg.content,
      }))),
      { role: 'user', content: message },
    ];

    let aiResponse, intentData;
    const aiProvider = process.env.AI_PROVIDER;
    if (aiProvider === 'ollama') {
      // OLLAMA MODE (qwen2.5:7b, system+user, stream: false)
      try {
        const ollamaUrl = `${process.env.OLLAMA_BASE_URL}/api/chat`;
        // Always use qwen2.5:7b for this integration
        const ollamaModel = 'qwen2.5:7b';
        // Compose system and user messages
        const ollamaMessages = [
          {
            role: 'system',
            content: `You are LeadPilot AI (SaaS sales + support bot).\n\nReturn ONLY valid JSON. No markdown. No extra words.\n\nJSON format:\n{\n  "headline": "string",\n  "bullets": ["string", "string", "string"],\n  "cta": "string"\n}\n\nRules:\n- headline max 14 words\n- bullets must be exactly 3\n- bullets must be benefits (not features)\n- cta must be a short question`
          },
          { role: 'user', content: message },
        ];
        const ollamaRes = await fetch(ollamaUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: ollamaModel,
            messages: ollamaMessages,
            stream: false,
          }),
        });
        if (!ollamaRes.ok) {
          throw new Error('Ollama API error');
        }
        const ollamaData = await ollamaRes.json();
        let parsedJson = null;
        try {
          parsedJson = JSON.parse(ollamaData?.message?.content || '');
        } catch (e) {
          // fallback below
        }
        if (
          !parsedJson ||
          typeof parsedJson !== 'object' ||
          typeof parsedJson.headline !== 'string' ||
          !Array.isArray(parsedJson.bullets) ||
          parsedJson.bullets.length !== 3 ||
          typeof parsedJson.cta !== 'string'
        ) {
          // fallback to default JSON
          parsedJson = {
            headline: 'LeadPilot AI: Convert More Leads Effortlessly',
            bullets: [
              'Boosts your sales pipeline instantly',
              'Captures and qualifies leads 24/7',
              'Seamless CRM and analytics integration',
            ],
            cta: 'Would you like a quick demo?'
          };
        }
        aiResponse = {
          response: JSON.stringify(parsedJson),
          suggestedQuestions: [],
        };
        // Use mockBot for intent detection (or you can use your own logic)
        const mockIntent = mockBotReply(message, conversationHistory);
        intentData = {
          intent: mockIntent.intent,
          leadScore: mockIntent.leadScore,
          confidence: 1,
          suggestedQuestions: [],
        };
      } catch (err) {
        // Ollama not running or error: return friendly error
        aiResponse = {
          response: 'Sorry, the AI service is temporarily unavailable. Please try again later.',
          suggestedQuestions: [],
        };
        intentData = {
          intent: 'unknown',
          leadScore: 0,
          confidence: 0,
          suggestedQuestions: [],
        };
      }
    } else {
      // Default: Gemini/Groq or mockBot
      const hasAIKey = Boolean(process.env.GOOGLE_GEMINI_API_KEY || process.env.GROQ_API_KEY);
      if (hasAIKey) {
        aiResponse = await generateAIResponse(message, conversationHistory);
        intentData = await detectIntent(message, conversationHistory);
      } else {
        aiResponse = mockBotReply(message, conversationHistory);
        intentData = {
          intent: aiResponse.intent,
          leadScore: aiResponse.leadScore,
          confidence: 1,
          suggestedQuestions: aiResponse.suggestedQuestions,
        };
      }
    }

    let activeConversationId = conversationId || null

    if (supabaseEnabled) {
      const supabaseAdmin = getSupabaseAdmin()

      // Ensure conversation exists
      activeConversationId = await ensureConversation(
        supabaseAdmin,
        conversationId,
        sessionId
      )

      // Persist user message and AI response
      await saveMessage(
        supabaseAdmin,
        activeConversationId,
        'user',
        message,
        intentData.intent,
        intentData.leadScore
      )

      await saveMessage(
        supabaseAdmin,
        activeConversationId,
        'assistant',
        aiResponse.response,
        intentData.intent,
        intentData.leadScore
      )

      // Upsert lead record for this conversation
      await upsertLead(
        supabaseAdmin,
        activeConversationId,
        intentData.leadScore,
        intentData.intent,
        {
          email,
          name,
          company,
          phone,
        }
      )
    }

    // Only include qualification questions for lead/pricing/booking intents
    let suggestions: string[] = [];
    if (["lead", "pricing", "booking"].includes(intentData.intent)) {
      suggestions = aiResponse.suggestedQuestions || [];
    }

    return NextResponse.json({
      conversationId: activeConversationId,
      reply: aiResponse.response,
      suggestions,
      intent: intentData.intent,
      leadScore: intentData.leadScore,
    }, { status: 200 });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      {
        reply: 'Sorry, I am having trouble right now. Please try again.'
      },
      { status: 200 }
    );
  }
}
