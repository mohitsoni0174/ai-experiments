# 🚀 Quick Start Guide - SaaS Chat Platform

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- A Supabase account (create at supabase.com)
- An OpenAI API key (get at platform.openai.com)

## ⚙️ Step 1: Set Up Environment Variables

Create a `.env.local` file in the project root:

```env
# Get these from Supabase project settings
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Get this from OpenAI
OPENAI_API_KEY=sk-your_key_here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### How to Get Supabase Credentials:
1. Go to your Supabase project dashboard
2. Click "Settings" → "API"
3. Copy your Project URL and Anon Key
4. Copy Service Role Key (keep this secret!)

## 🗄️ Step 2: Set Up Database

1. In Supabase, go to "SQL Editor"
2. Create a new query and run:

```sql
-- Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own messages"
  ON messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## 🏃 Step 3: Run Development Server

```bash
npm install  # If you haven't installed dependencies yet
npm run dev
```

Open http://localhost:3000 in your browser.

## 📚 Project Structure

```
src/
├── app/
│   ├── api/chat/             # AI chat endpoint
│   ├── auth/
│   │   ├── signin/           # Login page
│   │   └── signup/           # Registration page
│   ├── dashboard/            # Protected user dashboard
│   ├── page.tsx              # Landing page
│   └── layout.tsx            # Root layout with chat widget
├── components/
│   ├── ChatWidget.tsx        # Floating chat widget
│   └── ui/button.tsx         # Button component
├── lib/
│   ├── ai/openai.ts          # OpenAI integration
│   ├── store/chat.ts         # Zustand chat state
│   └── supabase/
│       ├── client.ts         # Browser client
│       └── server.ts         # Server client
└── public/                   # Static assets
```

## 🎯 Key Features

### Landing Page (/)
- Feature showcase
- Sign up/Sign in links
- Navigation

### Authentication
- **Sign Up** (/auth/signup) - Create new account
- **Sign In** (/auth/signin) - Login to existing account
- Supabase Auth integration

### Chat Widget
- Floating button (bottom-right)
- Real-time messaging
- AI-powered responses
- Auto-scroll to latest messages
- Loading indicators

### Dashboard (/dashboard)
- Protected route (requires login)
- User profile display
- Conversation history
- Analytics stats
- Sign out button

### API
- **POST /api/chat** - Send message and get AI response
- Integrated with OpenAI API
- Error handling

## 🔌 API Endpoints

### Chat API
```
POST /api/chat

Request:
{
  "message": "What is the capital of France?"
}

Response:
{
  "content": "The capital of France is Paris..."
}
```

## 🔐 Authentication Flow

1. User visits landing page
2. Clicks "Sign Up" or "Sign In"
3. Enters email and password
4. Supabase authenticates user
5. Redirects to dashboard
6. Can access chat and manage profile

## 💬 Chat Widget Usage

1. Click the blue chat button (bottom-right)
2. Type your message
3. Press Enter or click Send
4. AI responds with answer
5. Chat history is stored
6. Click the X to close chat

## 🛠️ Building for Production

```bash
npm run build
npm start
```

## 📦 Deployment Options

### Vercel (Recommended)
1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables
4. Deploy

### Other Platforms
- AWS Amplify
- Google Cloud Run
- Azure App Service
- Railway
- Render
- Netlify

## ⚡ Performance Tips

- Images are optimized
- Code splitting enabled
- Static generation where possible
- API caching configured
- Lazy loading for components

## 🐛 Troubleshooting

### "Supabase URL is invalid"
- Make sure `.env.local` has correct URL format
- Example: `https://xxxxx.supabase.co`

### "OpenAI API key not found"
- Check `.env.local` has `OPENAI_API_KEY`
- Verify key is valid at platform.openai.com

### Chat not working
- Check browser console for errors
- Verify Supabase credentials in `.env.local`
- Ensure messages table exists in Supabase

### Build fails
- Run `npm install` to ensure all packages installed
- Delete `.next` folder and rebuild
- Check for TypeScript errors with `npm run build`

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🎓 Next Steps

1. Customize landing page with your branding
2. Add more AI features (file upload, image generation)
3. Implement conversation history in database
4. Add user profile customization
5. Create admin analytics dashboard
6. Add email notifications
7. Implement rate limiting
8. Add payment integration

## 📝 Notes

- Keep `.env.local` secret - never commit to Git
- Add to `.gitignore` if not already there
- Change OpenAI model in `lib/ai/openai.ts` if needed
- Adjust chat widget styling in `components/ChatWidget.tsx`
- Customize colors in Tailwind config

## 🆘 Getting Help

- Check the README.md for detailed setup
- Review error messages in browser console
- Check Next.js and Supabase documentation
- Create issues on GitHub if stuck

Happy coding! 🎉
