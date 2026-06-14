'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface Message {
  id: string
  role: string
  content: string
  created_at: string
  intent?: string
  lead_score?: number
}

interface ConversationDetail {
  id: string
  started_at: string
  ended_at?: string
  intent: string
  lead_score: number
  status: string
  summary?: string
  messages: Message[]
}

export default function ConversationThread({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [supabase, setSupabase] = useState<any>(null)
  const [conversation, setConversation] = useState<ConversationDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setSupabase(createClient())
  }, [])

  useEffect(() => {
    if (!supabase) return
    
    async function checkAuthAndLoadData() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/admin/login')
          return
        }

        // Load conversation details - in real app would call API
        setConversation({
          id: params.id,
          started_at: new Date().toISOString(),
          intent: 'lead',
          lead_score: 85,
          status: 'active',
          summary: 'Customer interested in enterprise plan',
          messages: [
            {
              id: '1',
              role: 'user',
              content: 'Hi, I am interested in your enterprise plan',
              created_at: new Date().toISOString(),
              intent: 'lead',
              lead_score: 85,
            },
            {
              id: '2',
              role: 'assistant',
              content:
                'Great! Our enterprise plan offers custom pricing and dedicated support. Can you tell me about your company size?',
              created_at: new Date().toISOString(),
            },
            {
              id: '3',
              role: 'user',
              content: 'We have about 50 employees',
              created_at: new Date().toISOString(),
            },
            {
              id: '4',
              role: 'assistant',
              content:
                "Perfect! For a team your size, our enterprise plan is ideal. We also offer volume discounts. What's your timeline for implementation?",
              created_at: new Date().toISOString(),
            },
          ],
        })
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndLoadData()
  }, [router, params.id])

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/conversations">
            <Button variant="ghost">← Back</Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Conversation Thread</h1>
            <p className="text-slate-600 text-sm">ID: {params.id}</p>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white border-r border-slate-200 p-6">
          <div className="space-y-2">
            <Link
              href="/admin/dashboard"
              className="block px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/conversations"
              className="block px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium"
            >
              Conversations
            </Link>
            <Link
              href="/admin/leads"
              className="block px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Leads
            </Link>
            <Link
              href="/admin/analytics"
              className="block px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Analytics
            </Link>
            <Link
              href="/admin/settings"
              className="block px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Settings
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-slate-600">Loading conversation...</div>
            </div>
          ) : conversation ? (
            <div className="grid grid-cols-3 gap-6">
              {/* Messages */}
              <div className="col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6 max-h-screen overflow-y-auto">
                  <div className="space-y-4">
                    {conversation.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            msg.role === 'user'
                              ? 'bg-blue-600 text-white rounded-br-none'
                              : 'bg-slate-100 text-slate-900 rounded-bl-none'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.role === 'user' ? 'text-blue-200' : 'text-slate-600'
                            }`}
                          >
                            {new Date(msg.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Conversation Info</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-slate-600">Status</p>
                      <p className="font-medium text-slate-900">{conversation.status}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Intent</p>
                      <p className="font-medium text-slate-900 capitalize">{conversation.intent}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Lead Score</p>
                      <p className="font-medium text-slate-900">{conversation.lead_score}/100</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Started</p>
                      <p className="font-medium text-slate-900">
                        {new Date(conversation.started_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {conversation.summary && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="font-semibold text-slate-900 mb-2">Summary</h3>
                    <p className="text-sm text-slate-600">{conversation.summary}</p>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  )
}
