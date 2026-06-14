import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('id') || undefined
    const sessionId = searchParams.get('sessionId') || undefined
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 200)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    if (conversationId) {
      const { data: conversation, error: convoError } = await supabaseAdmin
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single()

      if (convoError) throw convoError

      const { data: messages, error: msgError } = await supabaseAdmin
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (msgError) throw msgError

      return NextResponse.json({ conversation, messages: messages || [] })
    }

    let query = supabaseAdmin
      .from('conversations')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (sessionId) query = query.eq('session_id', sessionId)

    const { data, error, count } = await query.range(
      offset,
      offset + limit - 1
    )

    if (error) throw error

    return NextResponse.json({
      data: data || [],
      count: count || 0,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Conversations GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const body = await request.json()
    const { sessionId, userEmail, userName, status } = body

    const { data, error } = await supabaseAdmin
      .from('conversations')
      .insert([
        {
          session_id: sessionId || 'web',
          user_email: userEmail,
          user_name: userName,
          status: status || 'active',
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Conversations POST error:', error)
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    )
  }
}
