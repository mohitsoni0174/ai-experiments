/**
 * API Routes - Integration Checklist for LeadPilot AI
 * 
 * This file documents which API routes need Supabase integration updates.
 */

// ============================================
// API ROUTES INTEGRATION STATUS
// ============================================

/*
ROUTE: /api/chat/message
FILE: src/app/api/chat/message/route.ts
STATUS: ✅ UPDATED - Uses real AI (Gemini/Groq)
WHAT'S DONE:
  - Imports from @/lib/ai (generateAIResponse, detectIntent)
  - Converts message history to AI format
  - Returns AI response with intent and lead score
  - Support for conversation context

TODO (Optional):
  [ ] Add Supabase message storage:
      await saveMessage(conversationId, 'user', message, intentData)
      await saveMessage(conversationId, 'assistant', aiResponse.response)
  [ ] Save to database after AI response
*/

/*
ROUTE: /api/leads
FILE: src/app/api/leads/route.ts
STATUS: 🟡 NEEDS UPDATE
CURRENT: Returns mock leads
TODO:
  [ ] Connect to Supabase leads table
  [ ] Fetch real leads: 
      const { data } = await supabase.from('leads').select('*')
  [ ] Add filtering by status, intent, lead_score
  [ ] Add pagination for large datasets
  [ ] Add search by email/name

EXAMPLE CODE:
  import { supabase } from '@/lib/supabase/client'
  
  export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    let query = supabase.from('leads').select('*')
    
    if (status) {
      query = query.eq('status', status)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return NextResponse.json(data)
  }
*/

/*
ROUTE: /api/conversations
FILE: src/app/api/conversations/route.ts
STATUS: 🟡 NEEDS UPDATE
CURRENT: Unknown implementation
TODO:
  [ ] Create conversation table:
      POST to create new conversation
      GET to fetch conversation history
  [ ] Add sessionId tracking
  [ ] Store user email/name if provided
  [ ] Link to messages table

EXAMPLE:
  POST /api/conversations
  Response: { id: "uuid", sessionId: "string", createdAt: "2024-01-01" }
  
  GET /api/conversations/:id/messages
  Response: [{ role: 'user', content: '...', timestamp: '...' }, ...]
*/

/*
ROUTE: /api/admin/stats
FILE: src/app/api/admin/stats/route.ts
STATUS: 🟡 NEEDS UPDATE
CURRENT: Unknown
TODO:
  [ ] Query Supabase for:
      - Total conversations
      - Total messages
      - Average lead score
      - Intent distribution
      - New leads today
  [ ] Return analytics data

EXAMPLE:
  export async function GET() {
    const conversations = await supabase
      .from('conversations')
      .select('id')
    
    const messages = await supabase
      .from('messages')
      .select('id')
    
    const leads = await supabase
      .from('leads')
      .select('lead_score')
    
    return NextResponse.json({
      totalConversations: conversations.data?.length || 0,
      totalMessages: messages.data?.length || 0,
      avgLeadScore: calculateAverage(leads.data || []),
    })
  }
*/

// ============================================
// DATABASE SCHEMA REFERENCE
// ============================================

/*
TABLE: conversations
- id: UUID (primary key)
- session_id: TEXT
- user_email: TEXT (nullable)
- user_name: TEXT (nullable)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- status: TEXT (active/closed/archived)

TABLE: messages
- id: UUID (primary key)
- conversation_id: UUID (foreign key)
- role: TEXT (user/assistant)
- content: TEXT
- intent: TEXT (nullable)
- lead_score: INTEGER
- created_at: TIMESTAMP

TABLE: leads
- id: UUID (primary key)
- conversation_id: UUID (foreign key)
- email: TEXT
- name: TEXT
- company: TEXT (nullable)
- phone: TEXT (nullable)
- lead_score: INTEGER
- intent: TEXT
- status: TEXT (new/contacted/qualified/lost)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

TABLE: settings
- id: UUID (primary key)
- key: TEXT (unique)
- value: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
*/

// ============================================
// UTILITY FUNCTIONS TO IMPLEMENT
// ============================================

/*
File: src/lib/supabase/messages.ts

import { supabase } from './client'

export async function saveMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string,
  intent?: string,
  leadScore?: number
) {
  const { data, error } = await supabase
    .from('messages')
    .insert([{
      conversation_id: conversationId,
      role,
      content,
      intent,
      lead_score: leadScore || 0,
    }])

  if (error) throw error
  return data?.[0]
}

export async function getConversationMessages(conversationId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function deleteConversation(conversationId: string) {
  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', conversationId)

  if (error) throw error
  return true
}
*/

/*
File: src/lib/supabase/leads.ts

import { supabase } from './client'

export async function createLead(
  conversationId: string,
  leadData: {
    email: string
    name: string
    company?: string
    phone?: string
    leadScore: number
    intent: string
  }
) {
  const { data, error } = await supabase
    .from('leads')
    .insert([{
      conversation_id: conversationId,
      ...leadData,
      status: 'new',
    }])

  if (error) throw error
  return data?.[0]
}

export async function getLeads(filters?: {
  status?: string
  minScore?: number
  intent?: string
}) {
  let query = supabase.from('leads').select('*')

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }
  if (filters?.minScore) {
    query = query.gte('lead_score', filters.minScore)
  }
  if (filters?.intent) {
    query = query.eq('intent', filters.intent)
  }

  const { data, error } = await query.order('lead_score', { ascending: false })

  if (error) throw error
  return data
}

export async function updateLeadStatus(leadId: string, status: string) {
  const { data, error } = await supabase
    .from('leads')
    .update({ status, updated_at: new Date() })
    .eq('id', leadId)

  if (error) throw error
  return data?.[0]
}
*/

// ============================================
// TESTING CHECKLIST
// ============================================

/*
After implementing Supabase integration:

1. LOCAL TESTING
   [ ] Send message in chat widget
   [ ] Verify message appears in Supabase messages table
   [ ] Verify conversation created if new
   [ ] Verify lead_score and intent are captured
   [ ] Check browser console for errors
   [ ] Check server logs for errors

2. DATA VALIDATION
   [ ] Message content is correct
   [ ] Intent detection is working
   [ ] Lead scores are realistic (not all 0 or 100)
   [ ] Timestamps are correct
   [ ] IDs are properly linked (conversation_id references)

3. ADMIN DASHBOARD
   [ ] Can see messages in admin panel
   [ ] Can see leads filtered by status
   [ ] Can see stats (total conversations, etc.)
   [ ] Can search by email or name
   [ ] Can update lead status

4. PRODUCTION
   [ ] All environment variables set correctly
   [ ] Database connection works on production server
   [ ] Lead creation limits (no duplicates)
   [ ] Error handling for failed database writes
   [ ] Logging for debugging production issues

5. PERFORMANCE
   [ ] Response time for chat API < 2 seconds
   [ ] Response time for lead list API < 500ms
   [ ] Database queries use indexes
   [ ] No N+1 query problems
*/

// ============================================
// COMMON ERRORS & SOLUTIONS
// ============================================

/*
ERROR: "NEXT_PUBLIC_SUPABASE_URL is required"
SOLUTION: Check .env.local has NEXT_PUBLIC_SUPABASE_URL set

ERROR: "relation 'public.messages' does not exist"
SOLUTION: Run database migration in Supabase SQL Editor

ERROR: "JWT expired"
SOLUTION: Service role key might be wrong, verify in Supabase Settings

ERROR: "permission denied for schema public"
SOLUTION: Update RLS policies or use service role key for that operation

ERROR: "Too many requests"
SOLUTION: You're hitting rate limits on free tier, consider upgrading or optimizing queries
*/

// ============================================
// MIGRATION CHECKLIST
// ============================================

/*
Estimated time to complete all integrations: 2-3 hours

Priority (do in this order):
1. [ ] Update /api/chat/message (DONE - using real AI now)
2. [ ] Create conversation management functions
3. [ ] Create lead management functions
4. [ ] Update /api/leads route
5. [ ] Update /api/conversations route
6. [ ] Create /api/admin/stats route
7. [ ] Update admin dashboard to use real data
8. [ ] Test end-to-end flow
9. [ ] Deploy to production
10. [ ] Monitor logs for errors
*/

export const integrationChecklist = {
  chatMessage: "✅ DONE - Real AI integrated",
  leadsRoute: "🟡 TODO - Connect Supabase",
  conversationsRoute: "🟡 TODO - Connect Supabase",
  adminStats: "🟡 TODO - Create analytics",
  databaseMigration: "⏳ PENDING - User action",
};
