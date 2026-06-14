'use client'
import { ConversationsLineChart } from '@/components/ConversationsLineChart'


import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface DashboardStats {
  totalConversations: number
  totalLeads: number
  avgLeadScore: number
  conversionRate: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [supabase, setSupabase] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [demoMode, setDemoMode] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    totalConversations: 0,
    totalLeads: 0,
    avgLeadScore: 0,
    conversionRate: 0,
  })

  useEffect(() => {
    const client = createClient();
    setSupabase(client);

    async function checkAuth() {
      // Demo Admin Mode: allow access if demoAdmin flag is set
      const isDemo = typeof window !== 'undefined' && localStorage.getItem('demoAdmin') === 'true';
      // ...existing code...
    }
  }, [])


  // Date filter state
  const [dateRange, setDateRange] = useState<'7' | '30'>('7');
  // Dummy data for 7 and 30 days
  const chartDataSets = {
    '7': {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      values: [12, 19, 14, 23, 17, 21, 15],
    },
    '30': {
      labels: [
        'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Day 10',
        'Day 11', 'Day 12', 'Day 13', 'Day 14', 'Day 15', 'Day 16', 'Day 17', 'Day 18', 'Day 19', 'Day 20',
        'Day 21', 'Day 22', 'Day 23', 'Day 24', 'Day 25', 'Day 26', 'Day 27', 'Day 28', 'Day 29', 'Day 30',
      ],
      values: [12, 19, 14, 23, 17, 21, 15, 18, 20, 16, 22, 19, 17, 23, 20, 18, 21, 19, 22, 20, 18, 17, 21, 19, 20, 18, 22, 21, 19, 20],
    },
  };
  const chartData = chartDataSets[dateRange];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-row gap-8">
      {/* Sidebar */}
      <nav className="w-64 bg-white border-r border-slate-200 p-6 h-screen sticky top-0 flex-shrink-0">
        <div className="space-y-2">
          <Link
            href="/admin/dashboard"
            className="block px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium"
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

      {/* Logout Button - top right */}
      <button
        onClick={() => {
          localStorage.removeItem('demoAdmin');
          router.push('/admin/login');
        }}
        className="absolute top-8 right-8 bg-white text-blue-700 border border-blue-600 px-4 py-2 rounded-xl shadow-sm transition font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 z-50"
      >
        Logout
      </button>

      {/* Main Content */}
      <main className="flex-1 bg-white p-8 rounded-2xl shadow-sm mx-8 my-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Conversations"
            value={stats.totalConversations}
            icon="💬"
          />
          <StatCard title="Leads Generated" value={stats.totalLeads} icon="🎯" />
          <StatCard
            title="Avg Lead Score"
            value={`${stats.avgLeadScore}/100`}
            icon="⭐"
          />
          <StatCard
            title="Conversion Rate"
            value={`${stats.conversionRate}%`}
            icon="📈"
          />
        </div>

        {/* Conversations Line Chart with Date Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Conversations Per Day</h2>
            <div className="flex gap-2">
              <button
                className={`px-3 py-1 rounded text-sm font-medium border ${dateRange === '7' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-200'}`}
                onClick={() => setDateRange('7')}
              >
                Last 7 days
              </button>
              <button
                className={`px-3 py-1 rounded text-sm font-medium border ${dateRange === '30' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-200'}`}
                onClick={() => setDateRange('30')}
              >
                Last 30 days
              </button>
            </div>
          </div>
          <ConversationsLineChart data={chartData} />
        </div>

        {/* Recent Leads Table */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-12">
          <div className="px-6 pt-6 pb-2 font-bold text-lg text-gray-800">Recent Leads</div>
          <div className="overflow-x-auto px-6 pb-6">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2 px-3 font-semibold text-gray-600">Name</th>
                  <th className="py-2 px-3 font-semibold text-gray-600">Email</th>
                  <th className="py-2 px-3 font-semibold text-gray-600">Source</th>
                  <th className="py-2 px-3 font-semibold text-gray-600">Time</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Ava Patel', email: 'ava@novacrm.com', source: 'Website', time: '2 min ago' },
                  { name: 'Liam Chen', email: 'liam@growthly.io', source: 'Landing Page', time: '10 min ago' },
                  { name: 'Sophia Lee', email: 'sophia@salesflow.com', source: 'Widget', time: '25 min ago' },
                  { name: 'Noah Smith', email: 'noah@supportpro.com', source: 'Website', time: '1 hr ago' },
                  { name: 'Mia Jones', email: 'mia@leadify.com', source: 'Widget', time: '2 hr ago' },
                ].map((lead, idx) => (
                  <tr key={idx} className="border-b last:border-b-0">
                    <td className="py-2 px-3 text-gray-800">{lead.name}</td>
                    <td className="py-2 px-3 text-gray-600">{lead.email}</td>
                    <td className="py-2 px-3 text-gray-600">{lead.source}</td>
                    <td className="py-2 px-3 text-gray-500">{lead.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin/conversations">
              <Button variant="outline" className="w-full">
                View Conversations
              </Button>
            </Link>
            <Link href="/admin/leads">
              <Button variant="outline" className="w-full">
                View Leads
              </Button>
            </Link>
            <Link href="/admin/analytics">
              <Button variant="outline" className="w-full">
                Analytics
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button variant="outline" className="w-full">
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  icon: string
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  )
}
