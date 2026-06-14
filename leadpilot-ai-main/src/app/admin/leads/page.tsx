'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface Lead {
  id: string
  name: string
  email: string
  company?: string
  lead_score: number
  status: string
  created_at: string
}

export default function LeadsPage() {
  const router = useRouter()
  const [supabase, setSupabase] = useState<any>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all')
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
        setLeads([
          {
            id: '1',
            name: 'Alice Johnson',
            email: 'alice@techcorp.com',
            company: 'TechCorp Inc',
            lead_score: 92,
            status: 'qualified',
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            name: 'Bob Smith',
            email: 'bob@startup.io',
            company: 'StartupIO',
            lead_score: 78,
            status: 'contacted',
            created_at: new Date().toISOString(),
          },
          {
            id: '3',
            name: 'Carol Williams',
            email: 'carol@digital.co',
            company: 'Digital Solutions',
            lead_score: 65,
            status: 'new',
            created_at: new Date().toISOString(),
          },
          {
            id: '4',
            name: 'David Brown',
            email: 'david@enterprise.com',
            company: 'Enterprise Ltd',
            lead_score: 88,
            status: 'converted',
            created_at: new Date().toISOString(),
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
            setLeads([
              {
                id: '1',
                name: 'Alice Johnson',
                email: 'alice@techcorp.com',
                company: 'TechCorp Inc',
                lead_score: 92,
                status: 'qualified',
                created_at: new Date().toISOString(),
              },
              {
                id: '2',
                name: 'Bob Smith',
                email: 'bob@startup.io',
                company: 'StartupIO',
                lead_score: 78,
                status: 'contacted',
                created_at: new Date().toISOString(),
              },
              {
                id: '3',
                name: 'Carol Williams',
                email: 'carol@digital.co',
                company: 'Digital Solutions',
                lead_score: 65,
                status: 'new',
                created_at: new Date().toISOString(),
              },
              {
                id: '4',
                name: 'David Brown',
                email: 'david@enterprise.com',
                company: 'Enterprise Ltd',
                lead_score: 88,
                status: 'converted',
                created_at: new Date().toISOString(),
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
          setLeads([
            {
              id: '1',
              name: 'Alice Johnson',
              email: 'alice@techcorp.com',
              company: 'TechCorp Inc',
              lead_score: 92,
              status: 'qualified',
              created_at: new Date().toISOString(),
            },
            {
              id: '2',
              name: 'Bob Smith',
              email: 'bob@startup.io',
              company: 'StartupIO',
              lead_score: 78,
              status: 'contacted',
              created_at: new Date().toISOString(),
            },
            {
              id: '3',
              name: 'Carol Williams',
              email: 'carol@digital.co',
              company: 'Digital Solutions',
              lead_score: 65,
              status: 'new',
              created_at: new Date().toISOString(),
            },
            {
              id: '4',
              name: 'David Brown',
              email: 'david@enterprise.com',
              company: 'Enterprise Ltd',
              lead_score: 88,
              status: 'converted',
              created_at: new Date().toISOString(),
            },
          ]);
        }
      } catch (error) {
        if (isDemo) {
          setDemoMode(true);
          setUser({ email: 'admin@example.com' });
          setLeads([
            {
              id: '1',
              name: 'Alice Johnson',
              email: 'alice@techcorp.com',
              company: 'TechCorp Inc',
              lead_score: 92,
              status: 'qualified',
              created_at: new Date().toISOString(),
            },
            {
              id: '2',
              name: 'Bob Smith',
              email: 'bob@startup.io',
              company: 'StartupIO',
              lead_score: 78,
              status: 'contacted',
              created_at: new Date().toISOString(),
            },
            {
              id: '3',
              name: 'Carol Williams',
              email: 'carol@digital.co',
              company: 'Digital Solutions',
              lead_score: 65,
              status: 'new',
              created_at: new Date().toISOString(),
            },
            {
              id: '4',
              name: 'David Brown',
              email: 'david@enterprise.com',
              company: 'Enterprise Ltd',
              lead_score: 88,
              status: 'converted',
              created_at: new Date().toISOString(),
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

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-purple-100 text-purple-800',
      converted: 'bg-green-100 text-green-800',
      lost: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const filteredLeads =
    filter === 'all' ? leads : leads.filter((lead) => lead.status === filter)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Leads CRM</h1>
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
              className="block px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Conversations
            </Link>
            <Link
              href="/admin/leads"
              className="block px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium"
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
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex gap-2 flex-wrap">
              {['all', 'new', 'contacted', 'qualified', 'converted', 'lost'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Leads Table */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-slate-600">Loading leads...</div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        Score
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
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                          {lead.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{lead.email}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {lead.company || '-'}
                        </td>
                        <td className={`px-6 py-4 text-sm font-semibold ${getScoreColor(lead.lead_score)}`}>
                          {lead.lead_score}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              lead.status
                            )}`}
                          >
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <Link href={`/admin/leads/${lead.id}`}>
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
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-sm text-slate-600">
                Showing {filteredLeads.length} leads
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
