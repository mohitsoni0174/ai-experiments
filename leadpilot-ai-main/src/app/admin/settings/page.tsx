'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface Settings {
  businessName: string
  businessEmail: string
  botTone: string
  enableLeadCapture: boolean
  enableAnalytics: boolean
}

export default function SettingsPage() {
  const router = useRouter()
  const [supabase, setSupabase] = useState<any>(null)
  const [settings, setSettings] = useState<Settings>({
    businessName: 'Acme Corp',
    businessEmail: 'admin@acmecorp.com',
    botTone: 'friendly',
    enableLeadCapture: true,
    enableAnalytics: true,
  })
  const [demoMode, setDemoMode] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const client = createClient();
    setSupabase(client);

    async function checkAuthAndLoadSettings() {
      const isDemo = typeof window !== 'undefined' && localStorage.getItem('demoAdmin') === 'true';
      if (!client && isDemo) {
        setDemoMode(true);
        setUser({ email: 'admin@example.com' });
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
            setIsLoading(false);
            return;
          } else {
            router.push('/admin/login');
            return;
          }
        } else {
          setUser(user);
          setDemoMode(false);
        }
      } catch (error) {
        if (isDemo) {
          setDemoMode(true);
          setUser({ email: 'admin@example.com' });
        } else {
          router.push('/admin/login');
        }
      } finally {
        setIsLoading(false);
      }
    }
    checkAuthAndLoadSettings();
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

  async function handleSave() {
    setIsSaving(true)
    setMessage('')

    try {
      // In real app would call API to save settings
      await new Promise((resolve) => setTimeout(resolve, 500))
      setMessage('Settings saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error saving:', error)
      setMessage('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
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
              className="block px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Analytics
            </Link>
            <Link
              href="/admin/settings"
              className="block px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium"
            >
              Settings
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-slate-600">Loading settings...</div>
            </div>
          ) : (
            <div className="max-w-2xl">
              {message && (
                <div
                  className={`mb-6 p-4 rounded-lg ${
                    message.includes('success')
                      ? 'bg-green-50 border border-green-200 text-green-700'
                      : 'bg-red-50 border border-red-200 text-red-700'
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Business Information */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">Business Information</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-slate-700 mb-2">
                      Business Name
                    </label>
                    <input
                      id="businessName"
                      type="text"
                      value={settings.businessName}
                      onChange={(e) =>
                        setSettings({ ...settings, businessName: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>
                  <div>
                    <label htmlFor="businessEmail" className="block text-sm font-medium text-slate-700 mb-2">
                      Business Email
                    </label>
                    <input
                      id="businessEmail"
                      type="email"
                      value={settings.businessEmail}
                      onChange={(e) =>
                        setSettings({ ...settings, businessEmail: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>
                </div>
              </div>

              {/* Bot Configuration */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">Bot Configuration</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="botTone" className="block text-sm font-medium text-slate-700 mb-2">
                      Bot Tone
                    </label>
                    <select
                      id="botTone"
                      value={settings.botTone}
                      onChange={(e) => setSettings({ ...settings, botTone: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    >
                      <option value="friendly">Friendly</option>
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                    </select>
                    <p className="text-sm text-slate-600 mt-1">
                      Choose the communication style for your bot
                    </p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">Features</h2>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enableLeadCapture}
                      onChange={(e) =>
                        setSettings({ ...settings, enableLeadCapture: e.target.checked })
                      }
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <div>
                      <p className="font-medium text-slate-700">Enable Lead Capture</p>
                      <p className="text-sm text-slate-600">
                        Collect visitor information when lead intent is detected
                      </p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enableAnalytics}
                      onChange={(e) =>
                        setSettings({ ...settings, enableAnalytics: e.target.checked })
                      }
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <div>
                      <p className="font-medium text-slate-700">Enable Analytics</p>
                      <p className="text-sm text-slate-600">
                        Track conversations and generate insights
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
