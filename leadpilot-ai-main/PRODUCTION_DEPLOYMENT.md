
# LeadPilot AI - Production Deployment Guide

## Overview
LeadPilot AI is now configured for production deployment with real AI integration and database support. This guide walks through the final setup steps.

---

## Phase 1: Environment Configuration (5-10 minutes)

### Step 1: Create `.env.local` file

Copy the template and fill in your credentials:

```bash
# Copy from .env.example
cp .env.example .env.local
```

### Step 2: Get Supabase Credentials

1. Visit https://supabase.com/dashboard
2. Click "New Project"
3. Fill in:
   - **Name**: `leadpilot-ai`
   - **Password**: Generate strong password
   - **Region**: Select closest to your users
4. Wait for project initialization (2-3 minutes)
5. Go to Settings > API > Copy these values:

```env
# From Supabase Dashboard Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Get AI Provider Key (Choose One)

#### Option A: Google Gemini (Recommended - Free tier available)

1. Visit https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key
4. Add to `.env.local`:

```env
GOOGLE_GEMINI_API_KEY=AIzaSy...your-key-here
```

#### Option B: Groq (Faster inference - Free tier available)

1. Visit https://console.groq.com/keys
2. Click "Create API Key"
3. Copy the key
4. Add to `.env.local`:

```env
GROQ_API_KEY=gsk_...your-key-here
```

### Step 4: Verify `.env.local`

Your complete `.env.local` should look like:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# AI Provider (choose one)
GOOGLE_GEMINI_API_KEY=AIzaSy...
# OR
GROQ_API_KEY=gsk_...

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## Phase 2: Database Setup (10-15 minutes)

### Step 1: Run Database Migration

1. Go to your Supabase project dashboard
2. Click "SQL Editor" in left sidebar
3. Click "New Query"
4. Copy and paste the entire SQL schema from `src/lib/supabase/setup-guide.ts`
5. Click "Run"
6. You should see success messages for each table creation

**Tables created:**
- `conversations` - Chat sessions
- `messages` - Individual messages
- `leads` - Qualified lead records
- `settings` - App configuration

### Step 2: Verify Tables

1. Click "Table Editor" in left sidebar
2. Verify you can see all 4 new tables:
   - `conversations`
   - `messages`
   - `leads`
   - `settings`

### Step 3: Set Up Row Level Security (Optional but Recommended)

1. Click "Authentication" > "Policies"
2. For production, create policies to restrict data access
3. For development, you can skip this step

---

## Phase 3: Test Local Integration (5 minutes)

### Step 1: Restart Development Server

```bash
# Kill existing server (Ctrl+C)
# Then:
npm run dev
```

### Step 2: Test Chat Widget

1. Open http://localhost:3000
2. Scroll down to "Chat with LeadPilot AI"
3. Send a test message like: "Hey, what's your pricing?"
4. You should see a real AI response
5. Try another: "I'm looking for a lead qualification tool"

### Step 3: Verify Database Storage

1. Go to Supabase dashboard
2. Click "Table Editor"
3. Click `messages` table
4. You should see your test messages stored

**Success indicators:**
- ✅ Chat responds with real AI (Gemini or Groq)
- ✅ Responses are unique, not mocked
- ✅ Messages appear in Supabase database
- ✅ Lead scores are calculated

---

## Phase 4: Production Deployment (15-30 minutes)

### Option A: Deploy to Vercel (Recommended - Free tier)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Connect to GitHub** (one-time setup)
   - Push your code to GitHub
   - Go to https://vercel.com/import
   - Select your GitHub repository

3. **Add Environment Variables in Vercel Dashboard**
   - Go to your project settings
   - Click "Environment Variables"
   - Add all 6 variables from `.env.local`
   - Deploy

4. **Deploy Command**
   ```bash
   vercel
   ```

### Option B: Deploy to Other Platforms

**Heroku (free tier available):**
```bash
heroku create your-app-name
git push heroku main
# Add env variables in Heroku dashboard
```

**Railway (free tier available):**
- Connect GitHub repo
- Add environment variables
- Auto-deploys on push

**AWS/Azure:**
- Follow their Next.js deployment guides
- Add environment variables to their dashboards

---

## Phase 5: Post-Deployment (5 minutes)

### Step 1: Test Production URL

1. Open your deployed URL (e.g., `https://leadpilot-ai.vercel.app`)
2. Test chat widget with a message
3. Verify message appears in Supabase
4. Check that AI responses work

### Step 2: Monitor Performance

**Supabase Dashboard Monitoring:**
- Click "Database" > "Queries"
- View real-time API usage
- Monitor response times

**Vercel Analytics (if deployed):**
- Check deployment status
- View error logs
- Monitor edge function performance

### Step 3: Set Up Email Notifications (Optional)

For captured leads, consider adding email:

1. Supabase supports sending emails via:
   - Your own SMTP server
   - SendGrid integration
   - Mailgun integration

---

## Troubleshooting

### Chat Widget Not Responding

**Problem:** "I appreciate your interest..." default message

**Solutions:**
1. Verify API key is valid:
   ```bash
   # Check for typos in .env.local
   # Make sure no extra spaces
   ```
2. Check browser console for errors (F12)
3. Verify AI provider is running:
   - Gemini: https://aistudio.google.com/app/apikey (try making a test request)
   - Groq: https://console.groq.com (check API key status)

### Database Not Storing Messages

**Problem:** Messages don't appear in Supabase tables

**Solutions:**
1. Verify database credentials:
   ```bash
   # Test connection in Supabase SQL Editor
   SELECT * FROM messages LIMIT 1;
   ```
2. Check Node server logs for errors
3. Verify Row Level Security isn't blocking writes

### Deployment Fails

**Problem:** Build errors or failed deployment

**Solutions:**
1. Check all environment variables are set
2. Verify no missing imports:
   ```bash
   npm run build
   ```
3. Check error logs in deployment platform
4. Verify Node version compatibility (16+)

---

## Performance Optimization

### 1. Enable Caching
```bash
# Supabase automatically caches queries
# No additional setup needed
```

### 2. Database Indexes
Indexes are already created for:
- `conversations(session_id)`
- `messages(conversation_id)`
- `leads(conversation_id)`
- `leads(email)`

### 3. API Response Caching
The AI responses are generated fresh for realism, but you can add caching:
```typescript
// Option: Cache for 5 minutes
res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate')
```

---

## Security Checklist

- ✅ Supabase API keys separated (public vs. private)
- ✅ Service role key stored server-side only
- ✅ Environment variables not committed to git
- ✅ HTTPS enabled on production
- ✅ Row Level Security policies created (optional)
- ✅ No API keys in client-side code

---

## Feature Summary - What's Now Live

**🎯 LeadPilot AI Platform**
- ✅ Professional landing page with pricing
- ✅ AI-powered chat widget (Gemini or Groq)
- ✅ Real-time intent detection
- ✅ Automated lead scoring
- ✅ Database persistence (Supabase)
- ✅ Admin dashboard for managing leads
- ✅ Mobile responsive design
- ✅ Dark mode ready

**📊 Admin Features**
- ✅ View all conversations
- ✅ See detected intents and lead scores
- ✅ Filter and sort leads
- ✅ Export data

**🔐 Production Ready**
- ✅ Scalable database
- ✅ Real AI integrations
- ✅ Error handling
- ✅ Security best practices
- ✅ Performance optimized

---

## Next Steps for Production Launch

1. ✅ **Environment Configuration** - Complete above
2. ✅ **Database Setup** - Complete above
3. ✅ **Local Testing** - Complete above
4. ✅ **Deploy to Production** - Complete above
5. 🟡 **Configure Email Notifications** - Optional, use Supabase Functions
6. 🟡 **Add Payment Processing** - Integrate Stripe for pricing
7. 🟡 **Set Up Analytics** - Add Google Analytics or Mixpanel
8. 🟡 **Enable CRM Integration** - Connect Salesforce/HubSpot

---

## Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Google Gemini API**: https://aistudio.google.com
- **Groq API**: https://console.groq.com
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

## Version Info

- **Platform**: LeadPilot AI
- **Framework**: Next.js 14+
- **Database**: Supabase (PostgreSQL)
- **AI**: Gemini 2.0 or Groq Mixtral
- **Deployment**: Vercel (recommended)
- **Updated**: 2024

---

✨ **Your platform is ready for production!** ✨

Follow the steps above to get live. For questions, refer to the official documentation for each service.
