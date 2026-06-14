# LeadPilot AI - Quick Start Guide

## 🚀 Get Running in 3 Steps

### Step 1: Configure Environment (2 minutes)

Copy and save this as `.env.local` in your project root:

```bash
# Copy the template
cp .env.example .env.local
```

Then fill in your API keys:

**Option A - Google Gemini (Recommended)**
```env
GOOGLE_GEMINI_API_KEY=AIzaSy...your-key...
```
👉 Get free key: https://aistudio.google.com/app/apikey

**Option B - Groq (Faster)**
```env
GROQ_API_KEY=gsk_...your-key...
```
👉 Get free key: https://console.groq.com/keys

**Supabase (Optional - for production)**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```
👉 Create account: https://supabase.com

### Step 2: Start Dev Server (1 minute)

```bash
npm run dev
```

You should see:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Ready in 948ms
```

### Step 3: Test the Platform (1 minute)

1. Open http://localhost:3000
2. Scroll down to "Chat with LeadPilot AI"
3. Type: "Hi, I need a lead qualification tool"
4. 🎉 See real AI response!

---

## ✨ Features Now Live

- ✅ **Professional Landing Page** - Pricing, testimonials, features
- ✅ **Real AI Chat Widget** - Powered by Gemini or Groq
- ✅ **Intent Detection** - Automatically detects what customer wants
- ✅ **Lead Scoring** - Rates prospect quality 0-100
- ✅ **Admin Dashboard** - Manage all conversations and leads
- ✅ **Dark Mode Ready** - Beautiful on all devices

---

## 🎯 Next Actions (Optional but Recommended)

### For Production Deployment:

1. **Get Supabase Credentials**
   - Create account: https://supabase.com
   - Create project: "leadpilot-ai"
   - Copy API keys to `.env.local`

2. **Run Database Migration**
   - Open Supabase Dashboard > SQL Editor
   - Copy SQL from [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md)
   - Run the migration
   - See 4 new tables created ✨

3. **Deploy to Vercel**
   ```bash
   npm i -g vercel
   vercel
   ```
   - Add environment variables in Vercel dashboard
   - Your site goes live! 🚀

---

## 📚 Documentation

- **[PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md)** - Full deployment guide
- **[API_INTEGRATION_CHECKLIST.md](API_INTEGRATION_CHECKLIST.md)** - API routes integration
- **[src/lib/ai/](src/lib/ai/)** - AI provider implementations
- **[src/lib/supabase/setup-guide.ts](src/lib/supabase/setup-guide.ts)** - Database schema

---

## 🔧 Troubleshooting

**Q: Chat not responding**
A: Check that you added the API key correctly to `.env.local` (no extra spaces)

**Q: Getting "NEXT_PUBLIC_SUPABASE_URL is required"**
A: That's normal for development - only needed for production. Add it to `.env.local` if using Supabase

**Q: Build fails with module errors**
A: Run `npm install` to ensure all packages are installed

**Q: Changes not appearing?**
A: Stop dev server (Ctrl+C), run `npm run dev` again

---

## 💡 Code Examples

### Send Message to AI

```typescript
const response = await fetch('/api/chat/message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'What are your plans?',
    conversationId: 'unique-id',
    messages: [] // previous messages
  })
})

const { content, intent, leadScore } = await response.json()
// content: "We have three tiers..."
// intent: "pricing"
// leadScore: 45
```

### Use AI Directly

```typescript
import { generateAIResponse } from '@/lib/ai'

const result = await generateAIResponse(
  'Tell me about your product',
  [] // previous conversation
)

console.log(result)
// {
//   response: "We're LeadPilot AI...",
//   intent: "lead",
//   leadScore: 65,
//   suggestedQuestions: [...]
// }
```

---

## 📊 What's Included

```
LeadPilot AI Platform
├── 🌐 Landing Page
│   ├── Hero section
│   ├── Features showcase
│   ├── 3-tier pricing
│   └── Real testimonials
├── 💬 Chat Widget
│   ├── Real-time AI responses
│   ├── Intent detection
│   ├── Lead scoring
│   └── Context awareness
├── 🎛️ Admin Dashboard
│   ├── View conversations
│   ├── See detected intents
│   ├── Filter by lead score
│   └── Export data
└── 🔌 API Routes
    ├── /api/chat/message (AI endpoint)
    ├── /api/leads (manage leads)
    ├── /api/conversations (chat history)
    └── /api/admin/stats (analytics)
```

---

## 🎨 Color Scheme

Modern professional theme:
- **Primary**: Royal Blue (#2563EB)
- **Accent**: Indigo (#4F46E5)
- **Text**: Slate Gray (#0F172A)
- **Background**: White/Slate-50

---

## 🚀 Deploy to Production

### Vercel (Easiest)
```bash
npm i -g vercel
vercel
# Add env variables in dashboard
```

### Netlify
- Connect GitHub repo
- Add environment variables
- Auto-deploys on push

### Docker
```bash
docker build -t leadpilot-ai .
docker run -p 3000:3000 leadpilot-ai
```

---

## 📞 Support

- **Supabase Docs**: https://supabase.com/docs
- **Google Gemini Docs**: https://ai.google.dev
- **Groq Docs**: https://console.groq.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

## ✅ Success Checklist

- [ ] `.env.local` created with API key
- [ ] Dev server running (no errors)
- [ ] Chat widget responding
- [ ] Can see real AI responses
- [ ] Landing page displays correctly
- [ ] Admin dashboard opens
- [ ] Ready to invite users!

---

**That's it! Your AI-powered lead qualification platform is ready.** 🎉

Next step: Customize your branding, add your company info, and deploy to production.

For detailed production setup, see [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md)
