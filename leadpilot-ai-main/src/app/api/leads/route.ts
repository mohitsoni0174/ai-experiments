import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || undefined
    const intent = searchParams.get('intent') || undefined
    const email = searchParams.get('email') || undefined
    const search = searchParams.get('search') || undefined
    const minScore = searchParams.get('minScore')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 200)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    let query = supabaseAdmin
      .from('leads')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (status) query = query.eq('status', status)
    if (intent) query = query.eq('intent', intent)
    if (email) query = query.ilike('email', `%${email}%`)
    if (minScore) query = query.gte('lead_score', parseInt(minScore, 10))
    if (search)
      query = query.or(
        `email.ilike.%${search}%,name.ilike.%${search}%,company.ilike.%${search}%`
      )

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
    console.error('Leads GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const body = await request.json()
    const { conversationId, email, name, company, phone, leadScore, intent, status }
      = body

    if (!conversationId) {
      return NextResponse.json(
        { error: 'conversationId is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert([
        {
          conversation_id: conversationId,
          email,
          name,
          company,
          phone,
          lead_score: leadScore ?? 0,
          intent: intent || 'lead',
          status: status || 'new',
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Leads POST error:', error)
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 })
  }
}
