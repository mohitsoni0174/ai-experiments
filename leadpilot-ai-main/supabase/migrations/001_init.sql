-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_ip TEXT NOT NULL,
  started_at TIMESTAMP NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMP,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived')),
  intent TEXT,
  lead_score INTEGER DEFAULT 0,
  summary TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  intent TEXT,
  lead_score INTEGER,
  suggestions TEXT[], -- JSON array stored as text
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  budget TEXT,
  timeline TEXT,
  requirement TEXT,
  lead_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Settings table
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL DEFAULT 'Our Company',
  business_email TEXT NOT NULL,
  bot_tone TEXT DEFAULT 'friendly' CHECK (bot_tone IN ('friendly', 'professional', 'casual')),
  enable_lead_capture BOOLEAN DEFAULT true,
  enable_analytics BOOLEAN DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at);

-- Row Level Security (RLS)
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations (allow read for all, write for admin)
CREATE POLICY "Allow read conversations" ON conversations FOR SELECT USING (true);
CREATE POLICY "Allow admin manage conversations" ON conversations FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for messages (allow read for all, write for admin)
CREATE POLICY "Allow read messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Allow admin manage messages" ON messages FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for leads (allow read/write for admin only)
CREATE POLICY "Allow admin read leads" ON leads FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow admin manage leads" ON leads FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for settings (allow read for all, write for admin)
CREATE POLICY "Allow read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Allow admin manage settings" ON settings FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
