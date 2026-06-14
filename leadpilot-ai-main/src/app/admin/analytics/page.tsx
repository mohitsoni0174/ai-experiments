'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface AnalyticsData {
  totalConversations: number
  totalLeads: number
  conversionRate: number
  avgLeadScore: number
  topIntents: { intent: string; count: number }[]
  leadsByStatus: { status: string; count: number }[]
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [supabase, setSupabase] = useState<any>(null)
  const [data, setData] = useState<AnalyticsData | null>(null)
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
        setData({
          totalConversations: 342,
          totalLeads: 87,
          conversionRate: 25.4,
          avgLeadScore: 71.3,
          topIntents: [
            { intent: 'lead', count: 145 },
            { intent: 'pricing', count: 98 },
            { intent: 'booking', count: 67 },
            { intent: 'support', count: 32 },
          ],
          leadsByStatus: [
            { status: 'new', count: 23 },
            { status: 'contacted', count: 31 },
            { status: 'qualified', count: 21 },
            { status: 'converted', count: 12 },
          ],
        });
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
            setData({
              totalConversations: 342,
              totalLeads: 87,
              conversionRate: 25.4,
              avgLeadScore: 71.3,
              topIntents: [
                { intent: 'lead', count: 145 },
                { intent: 'pricing', count: 98 },
                { intent: 'booking', count: 67 },
                { intent: 'support', count: 32 },
              ],
              leadsByStatus: [
                { status: 'new', count: 23 },
                { status: 'contacted', count: 31 },
                { status: 'qualified', count: 21 },
                { status: 'converted', count: 12 },
              ],
            });
            setIsLoading(false);
            return;
          } else {
            router.push('/admin/login');
            return;
          }
        } else {
          setUser(user);
          setDemoMode(false);
          setData({
            totalConversations: 342,
            totalLeads: 87,
            conversionRate: 25.4,
            avgLeadScore: 71.3,
            topIntents: [
              { intent: 'lead', count: 145 },
              { intent: 'pricing', count: 98 },
              { intent: 'booking', count: 67 },
              { intent: 'support', count: 32 },
            ],
            leadsByStatus: [
              { status: 'new', count: 23 },
              { status: 'contacted', count: 31 },
              { status: 'qualified', count: 21 },
              { status: 'converted', count: 12 },
            ],
          });
        }
      } catch (error) {
        if (isDemo) {
          setDemoMode(true);
          setUser({ email: 'admin@example.com' });
          setData({
            totalConversations: 342,
            totalLeads: 87,
            conversionRate: 25.4,
            avgLeadScore: 71.3,
            topIntents: [
              { intent: 'lead', count: 145 },
              { intent: 'pricing', count: 98 },
              { intent: 'booking', count: 67 },
              { intent: 'support', count: 32 },
            ],
            leadsByStatus: [
              { status: 'new', count: 23 },
              { status: 'contacted', count: 31 },
              { status: 'qualified', count: 21 },
              { status: 'converted', count: 12 },
            ],
          });
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
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
              className="block px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Leads
            </Link>
            <Link
              href="/admin/analytics"
              className="block px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium"
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
              <div className="text-slate-600">Loading analytics...</div>
            </div>
          ) : data ? (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <MetricCard
                  title="Total Conversations"
                  value={data.totalConversations}
                  unit="conversations"
                  color="blue"
                />
                <MetricCard
                  title="Leads Generated"
                  value={data.totalLeads}
                  unit="leads"
                  color="green"
                />
                <MetricCard
                  title="Conversion Rate"
                  value={data.conversionRate}
                  unit="%"
                  color="purple"
                />
                <MetricCard
                  title="Avg Lead Score"
                  value={data.avgLeadScore.toFixed(1)}
                  unit="/100"
                  color="amber"
                />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-2 gap-6">
                {/* Top Intents */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Top Intents</h2>
                  <div className="space-y-3">
                    {data.topIntents.map((item) => (
                      <div key={item.intent}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-slate-700 capitalize">
                            {item.intent}
                          </span>
                          <span className="text-sm font-semibold text-slate-900">{item.count}</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${(item.count / data.totalConversations) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Leads by Status */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Leads by Status</h2>
                  <div className="space-y-3">
                    {data.leadsByStatus.map((item) => {
                      const colors: Record<string, string> = {
                        new: 'bg-blue-600',
                        contacted: 'bg-yellow-600',
                        qualified: 'bg-purple-600',
                        converted: 'bg-green-600',
                      }
                      return (
                        <div key={item.status}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-slate-700 capitalize">
                              {item.status}
                            </span>
                            <span className="text-sm font-semibold text-slate-900">{item.count}</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${colors[item.status] || 'bg-slate-600'}`}
                              style={{
                                width: `${(item.count / data.totalLeads) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string | number
  unit: string
  color: string
}

function MetricCard({ title, value, unit, color }: MetricCardProps) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    amber: 'bg-amber-50 border-amber-200',
  }

  return (
    <div className={`rounded-lg border p-6 ${colorClasses[color]}`}>
      <p className="text-slate-600 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
      <p className="text-slate-600 text-xs mt-1">{unit}</p>
    </div>
  )
}
