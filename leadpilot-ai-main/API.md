# 📡 API Documentation

## Chat API

### Endpoint
```
POST /api/chat
```

### Description
Sends a user message to the AI and receives an intelligent response.

### Request

**Content-Type**: `application/json`

**Body**:
```json
{
  "message": "What is the capital of France?"
}
```

### Response

**Status**: 200 OK

```json
{
  "content": "The capital of France is Paris. It is located in the north-central part of the country and is the largest city in France. Paris is known as the City of Light and is famous for its iconic landmarks like the Eiffel Tower, Notre-Dame Cathedral, and the Louvre Museum."
}
```

### Error Responses

**Status**: 400 Bad Request
```json
{
  "error": "Invalid message"
}
```

**Status**: 500 Internal Server Error
```json
{
  "error": "Failed to process chat request"
}
```

### Examples

#### Using Fetch
```javascript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'Hello, how are you?'
  })
});

const data = await response.json();
console.log(data.content);
```

#### Using cURL
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is React?"}'
```

#### Using Python
```python
import requests

response = requests.post(
  'http://localhost:3000/api/chat',
  json={'message': 'Tell me a joke'}
)
data = response.json()
print(data['content'])
```

#### Using TypeScript
```typescript
interface ChatRequest {
  message: string;
}

interface ChatResponse {
  content: string;
}

async function chat(message: string): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  
  const data: ChatResponse = await response.json();
  return data.content;
}
```

---

## Supabase API Integration

### Authentication

#### Sign Up
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
  }
});
```

#### Sign In
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});
```

#### Sign Out
```typescript
const { error } = await supabase.auth.signOut();
```

#### Get Current User
```typescript
const { data: { user } } = await supabase.auth.getUser();
```

### Database Operations

#### Insert Message
```typescript
const { data, error } = await supabase
  .from('messages')
  .insert([
    {
      user_id: user.id,
      content: 'Hello AI!',
      role: 'user',
      conversation_id: conversationId
    }
  ]);
```

#### Get Messages
```typescript
const { data, error } = await supabase
  .from('messages')
  .select('*')
  .eq('conversation_id', conversationId)
  .order('created_at', { ascending: true });
```

#### Create Conversation
```typescript
const { data, error } = await supabase
  .from('conversations')
  .insert([
    {
      user_id: user.id,
      title: 'New Conversation'
    }
  ])
  .select();
```

---

## OpenAI API Integration

### Model: GPT-3.5-Turbo

#### Configuration
```typescript
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const response = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: [
    {
      role: 'system',
      content: 'You are a helpful AI assistant.'
    },
    {
      role: 'user',
      content: 'What is React?'
    }
  ],
  temperature: 0.7,
  max_tokens: 500,
});
```

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `model` | string | - | Model to use (e.g., 'gpt-3.5-turbo', 'gpt-4') |
| `messages` | array | - | Array of message objects |
| `temperature` | number | 1 | Randomness (0-2, lower = more focused) |
| `max_tokens` | number | - | Max tokens in response |
| `top_p` | number | 1 | Diversity via nucleus sampling |
| `frequency_penalty` | number | 0 | How much to penalize new tokens |
| `presence_penalty` | number | 0 | How much to penalize repeated tokens |

---

## State Management (Zustand)

### Chat Store

```typescript
import { useChatStore } from '@/lib/store/chat';

// Use the store
const {
  messages,
  isOpen,
  isLoading,
  addMessage,
  setMessages,
  toggleChat,
  setIsLoading,
  clearMessages
} = useChatStore();
```

### Store Methods

#### addMessage(message: Message)
Adds a single message to the store.

```typescript
useChatStore.getState().addMessage({
  id: '1',
  role: 'user',
  content: 'Hello',
  timestamp: new Date()
});
```

#### setMessages(messages: Message[])
Replaces all messages.

```typescript
useChatStore.getState().setMessages([...messages]);
```

#### toggleChat()
Toggles chat open/closed state.

```typescript
useChatStore.getState().toggleChat();
```

#### setIsLoading(loading: boolean)
Sets loading state.

```typescript
useChatStore.getState().setIsLoading(true);
```

#### clearMessages()
Clears all messages.

```typescript
useChatStore.getState().clearMessages();
```

---

## Environment Variables Reference

### Required

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# OpenAI
OPENAI_API_KEY=sk-proj-...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Optional

```env
NEXT_PUBLIC_APP_NAME=SaaS Chat
```

---

## Error Handling

### API Error Responses

All API endpoints return appropriate HTTP status codes:

- **200**: Success
- **400**: Bad Request (invalid input)
- **401**: Unauthorized
- **500**: Server Error

### Example Error Handling

```typescript
try {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Hello' })
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('API Error:', error.error);
    return;
  }

  const data = await response.json();
  console.log('Success:', data.content);
} catch (error) {
  console.error('Network Error:', error);
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider:

1. **Middleware-based**: Check request frequency
2. **API-based**: Use OpenAI's built-in limits
3. **Database-based**: Track user usage in Supabase

### Example Rate Limiter Implementation

```typescript
// Simple rate limiter
const rateLimits = new Map();

export function checkRateLimit(userId: string, limit: number = 10, window: number = 60000) {
  const now = Date.now();
  const userLimits = rateLimits.get(userId) || [];
  
  const recentRequests = userLimits.filter((time: number) => now - time < window);
  
  if (recentRequests.length >= limit) {
    return false; // Rate limit exceeded
  }
  
  recentRequests.push(now);
  rateLimits.set(userId, recentRequests);
  return true; // Allowed
}
```

---

## Pagination

### Messages Pagination Example

```typescript
const pageSize = 20;
const page = 0;

const { data } = await supabase
  .from('messages')
  .select('*')
  .eq('conversation_id', conversationId)
  .order('created_at', { ascending: false })
  .range(page * pageSize, (page + 1) * pageSize - 1);
```

---

## Real-time Updates

### Subscribe to Messages

```typescript
const channel = supabase
  .channel('messages')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `conversation_id=eq.${conversationId}`
    },
    (payload) => {
      console.log('New message:', payload.new);
    }
  )
  .subscribe();

// Unsubscribe
supabase.removeChannel(channel);
```

---

## Webhooks (Future)

For production, consider implementing webhooks:

```typescript
// Example webhook for message processing
export async function handleWebhook(payload: any) {
  const { data } = payload;
  
  if (data.role === 'user') {
    // Process user message
    const response = await generateAIResponse(data.content);
    
    // Save AI response
    await supabase
      .from('messages')
      .insert([{
        user_id: data.user_id,
        content: response,
        role: 'assistant',
        conversation_id: data.conversation_id
      }]);
  }
}
```

---

## Testing API Endpoints

### Using Postman

1. Set method to POST
2. URL: `http://localhost:3000/api/chat`
3. Headers: `Content-Type: application/json`
4. Body:
```json
{
  "message": "Hello"
}
```

### Using Thunder Client (VS Code)

1. Create new request
2. Method: POST
3. URL: `http://localhost:3000/api/chat`
4. Body: `{"message": "Hello"}`

### Using VS Code REST Client

Create `.rest` file:
```
POST http://localhost:3000/api/chat
Content-Type: application/json

{
  "message": "What is AI?"
}
```

---

## Performance Metrics

### Response Time Goals

- Chat API: < 2 seconds
- Database queries: < 500ms
- Authentication: < 1 second

### Current Optimizations

- Turbopack for fast builds
- Image optimization
- Code splitting
- API caching
- Database indexes

---

## Security Considerations

1. **API Key Protection**: Keep OpenAI key in `.env`
2. **SQL Injection**: Use Supabase parameterized queries
3. **XSS Protection**: React escapes by default
4. **CORS**: Next.js handles by default
5. **RLS**: Supabase enforces row-level security

---

## Versioning

Current API Version: **v1** (implicit)

For future versions:
```
POST /api/v2/chat
```

---

## Deprecation Policy

- Breaking changes: Major version bump
- Warnings: At least 2 minor versions before removal
- Notice: Documented in changelog

---

## Support

- Issues: Create GitHub issue
- Docs: See README.md, SETUP.md
- Questions: Check documentation first

---

Last Updated: January 17, 2026
