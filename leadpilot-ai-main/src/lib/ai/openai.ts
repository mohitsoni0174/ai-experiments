import { OpenAI } from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateAIResponse(message: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant. Provide concise and helpful responses.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    return response.choices[0]?.message?.content || 'No response generated'
  } catch (error) {
    console.error('AI Error:', error)
    throw new Error('Failed to generate AI response')
  }
}
