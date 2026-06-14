'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface Conversation {
  id: string
  started_at: string
  intent: string
  lead_score: number
  status: string
}

export default function ConversationsPage() {
  const router = useRouter()
  const [supabase, setSupabase] = useState<any>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [demoMode, setDemoMode] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const client = createClient();
    setSupabase(client);

    async function checkAuthAndLoadData() {
      const isDemo = typeof window !== 'undefined' && localStorage.getItem('demoAdmin') === 'true';
      if (!client && isDemo) {
        setDemoMode(true);
        setUser({ email: 'admin@example.com' });
        setConversations([
          {
            id: '1',
            started_at: new Date().toISOString(),
            intent: 'lead',
            lead_score: 85,
            status: 'active',
          },
          {
            id: '2',
            started_at: new Date().toISOString(),
            intent: 'pricing',
            lead_score: 45,
            status: 'closed',
          },
          {
            id: '3',
            started_at: new Date().toISOString(),
            intent: 'booking',
            lead_score: 72,
            status: 'active',
          },
        ]);
        setIsLoading(false);
        return;
      }
      try {
        const {
          data: { user },
        } = await client.auth.getUser();
        if (!user) {
          if (isDemo) {
            setDemoMode(true);
            setUser({ email: 'admin@example.com' });
            setConversations([
              {
                id: '1',
                started_at: new Date().toISOString(),
                intent: 'lead',
                lead_score: 85,
                status: 'active',
              },
              {
                id: '2',
                started_at: new Date().toISOString(),
                intent: 'pricing',
                lead_score: 45,
                status: 'closed',
              },
              {
                id: '3',
                started_at: new Date().toISOString(),
                intent: 'booking',
                lead_score: 72,
                status: 'active',
              },
            ]);
            setIsLoading(false);
            return;
          } else {
            router.push('/admin/login');
            return;
          }
        } else {
          setUser(user);
          setDemoMode(false);
          setConversations([
            {
              id: '1',
              started_at: new Date().toISOString(),
              intent: 'lead',
              lead_score: 85,
              status: 'active',
            },
            {
              id: '2',
              started_at: new Date().toISOString(),
              intent: 'pricing',
              lead_score: 45,
              status: 'closed',
            },
            {
              id: '3',
              started_at: new Date().toISOString(),
              intent: 'booking',
              lead_score: 72,
              status: 'active',
            },
          ]);
        }
      } catch (error) {
        if (isDemo) {
          setDemoMode(true);
          setUser({ email: 'admin@example.com' });
          setConversations([
            {
              id: '1',
              started_at: new Date().toISOString(),
              intent: 'lead',
              lead_score: 85,
              status: 'active',
            },
            {
              id: '2',
              started_at: new Date().toISOString(),
              intent: 'pricing',
              lead_score: 45,
              status: 'closed',
            },
            {
              id: '3',
              started_at: new Date().toISOString(),
              intent: 'booking',
              lead_score: 72,
              status: 'active',
            },
          ]);
        } else {
          router.push('/admin/login');
        }
      } finally {
        setIsLoading(false);
      }
    }
    checkAuthAndLoadData();
  }, [router]);
  function handleLogout() {
    if (demoMode) {
      localStorage.removeItem('demoAdmin');
      router.push('/admin/login');
      return;
    }
    if (supabase) {
      supabase.auth.signOut();
    }
    router.push('/');
  }

  const getIntentBadgeColor = (intent: string) => {
    const colors: Record<string, string> = {
      lead: 'bg-green-100 text-green-800',
      pricing: 'bg-blue-100 text-blue-800',
      booking: 'bg-purple-100 text-purple-800',
      support: 'bg-yellow-100 text-yellow-800',
      complaint: 'bg-red-100 text-red-800',
    }
    return colors[intent] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Conversations</h1>
            {demoMode && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-xs font-semibold">
                Demo Admin Mode
              </div>
            )}
          </div>
          <Button
            onClick={handleLogout}
            className="bg-white text-blue-700 border border-blue-600 px-4 py-2 rounded-xl shadow-sm transition font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 z-50"
          >
            Logout
          </Button>
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
              <div className="text-slate-600">Loading conversations...</div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        Started
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        Intent
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        Lead Score
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {conversations.map((conv) => (
                      <tr key={conv.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm text-slate-900">{conv.id}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(conv.started_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getIntentBadgeColor(
                              conv.intent
                            )}`}
                          >
                            {conv.intent}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                          {conv.lead_score}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              conv.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {conv.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <Link href={`/admin/conversations/${conv.id}`}>
                            <Button size="sm" variant="ghost">
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
