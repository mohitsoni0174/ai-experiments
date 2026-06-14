import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const [conversations, messages, leads, leadsToday, leadScores] = await Promise.all([
      supabaseAdmin
        .from('conversations')
        .select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('messages').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('leads').select('id', { count: 'exact', head: true }),
      supabaseAdmin
        .from('leads')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', startOfDay.toISOString()),
      supabaseAdmin.from('leads').select('lead_score,intent'),
    ])

    const totalLeads = leads.count || 0
    const scores = (leadScores.data || [])
      .map((row) => Number(row.lead_score))
      .filter((score) => Number.isFinite(score))

    const avgLeadScore = scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0

    const intentDistribution: Record<string, number> = {}
    ;(leadScores.data || []).forEach((row) => {
      const key = row.intent || 'unknown'
      intentDistribution[key] = (intentDistribution[key] || 0) + 1
    })

    return NextResponse.json({
      totalConversations: conversations.count || 0,
      totalMessages: messages.count || 0,
      totalLeads,
      newLeadsToday: leadsToday.count || 0,
      avgLeadScore,
      intentDistribution,
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: 'Failed to load admin stats' },
      { status: 500 }
    )
  }
}
