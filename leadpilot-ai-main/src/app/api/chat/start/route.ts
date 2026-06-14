import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const conversationId = uuidv4()
    const timestamp = new Date().toISOString()

    // In a real app, save to Supabase here:
    // const { error } = await supabase
    //   .from('conversations')
    //   .insert({
    //     id: conversationId,
    //     user_ip: request.ip,
    //     started_at: timestamp,
    //     status: 'active'
    //   })

    return NextResponse.json({
      conversationId,
      timestamp,
    })
  } catch (error) {
    console.error('Conversation start error:', error)
    return NextResponse.json(
      { error: 'Failed to start conversation' },
      { status: 500 }
    )
  }
}
