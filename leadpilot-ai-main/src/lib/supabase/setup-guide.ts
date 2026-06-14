/**
 * Supabase Setup Guide for LeadPilot AI
 * 
 * This file documents the steps to set up Supabase for production use.
 */

// ============================================
// ENVIRONMENT VARIABLES (add to .env.local)
// ============================================

// After creating a Supabase project:
// 1. Go to https://supabase.com/dashboard
// 2. Create a new project
// 3. Copy these values from Settings > API

/*
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
*/

// ============================================
// DATABASE SCHEMA
// ============================================

// Run this SQL in Supabase SQL Editor:

/*
-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  user_email TEXT,
  user_name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'active'
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  intent TEXT,
  lead_score INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  company TEXT,
  phone TEXT,
  lead_score INTEGER DEFAULT 0,
  intent TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings table
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_conversations_session ON conversations(session_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_leads_conversation ON leads(conversation_id);
CREATE INDEX idx_leads_email ON leads(email);
*/

// ============================================
// TYPESCRIPT CLIENT SETUP
// ============================================

// File: src/lib/supabase/client.ts

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Check your .env.local file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// EXAMPLE: SAVING A MESSAGE
// ============================================

/*
import { supabase } from '@/lib/supabase/client'

export async function saveMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string,
  intent?: string,
  leadScore?: number
) {
  const { data, error } = await supabase.from('messages').insert([
    {
      conversation_id: conversationId,
      role,
      content,
      intent,
      lead_score: leadScore || 0,
    },
  ])

  if (error) {
    console.error('Error saving message:', error)
    throw error
  }

  return data
}
*/

// ============================================
// EXAMPLE: SAVING A LEAD
// ============================================

/*
import { supabase } from '@/lib/supabase/client'

export async function saveLead(
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
  const { data, error } = await supabase.from('leads').insert([
    {
      conversation_id: conversationId,
      email: leadData.email,
      name: leadData.name,
      company: leadData.company,
      phone: leadData.phone,
      lead_score: leadData.leadScore,
      intent: leadData.intent,
    },
  ])

  if (error) {
    console.error('Error saving lead:', error)
    throw error
  }

  return data
}
*/

// ============================================
// SETUP CHECKLIST
// ============================================

/*
1. Create Supabase Account
   - Go to https://supabase.com
   - Sign up or log in

2. Create New Project
   - Click "New Project"
   - Enter project name: "leadpilot-ai"
   - Choose region closest to users
   - Generate password (save securely)
   - Wait for project initialization

3. Get API Keys
   - Go to Settings > API
   - Copy "Project URL" → NEXT_PUBLIC_SUPABASE_URL
   - Copy "anon public" key → NEXT_PUBLIC_SUPABASE_ANON_KEY
   - Copy "service_role" key → SUPABASE_SERVICE_ROLE_KEY

4. Add Environment Variables
   - Create/edit .env.local
   - Add all three keys from step 3
   - Save file

5. Run Database Migration
   - Go to Supabase > SQL Editor
   - Create new query
   - Copy the SQL schema from above
   - Run the migration

6. Update API Routes
   - Add supabase calls to:
     - src/app/api/chat/message/route.ts
     - src/app/api/leads/route.ts
     - src/app/api/conversations/route.ts

7. Test Integration
   - Open http://localhost:3000
   - Send test message in chat
   - Check Supabase Tables to verify data is saved

8. Set Up Backup
   - Go to Supabase > Settings > Backups
   - Enable automatic backups

9. Configure RLS (Row Level Security)
   - Go to Supabase > Authentication
   - Create RLS policies as needed
   - Restrict access by user/session

10. Deploy
    - Push code to GitHub
    - Add env variables to Vercel/hosting platform
    - Deploy and test
*/

export const supabaseSetupGuide = {
  apiUrl: "https://supabase.com/dashboard",
  projectName: "leadpilot-ai",
  region: "auto", // Choose based on user location
  requiresSetup: true,
};
