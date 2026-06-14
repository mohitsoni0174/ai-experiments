'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export default function AdminLogin() {
  const router = useRouter()
  const [supabase, setSupabase] = useState<any>(null)
  const [demoMode, setDemoMode] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const client = createClient();
    setSupabase(client);
    if (!client) {
      setDemoMode(true);
    }
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    if (demoMode) {
      // Demo Admin Mode: hardcoded credentials
      if (email === "admin@example.com" && password === "admin1234") {
        try {
          // Set a localStorage flag for demo admin session
          localStorage.setItem("demoAdmin", "true");
          router.push("/admin/dashboard");
        } finally {
          setIsLoading(false);
        }
      } else {
        setError("Invalid demo admin credentials. Use admin@example.com / admin1234");
        setIsLoading(false);
      }
      return;
    }
    if (!supabase) {
      setError("Supabase is not configured. Demo Admin Mode unavailable.");
      setIsLoading(false);
      return;
    }
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) throw authError;
      if (data.user) {
        router.push("/admin/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl text-black">
        {/* Demo Admin Mode banner removed as requested */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="mt-2">Sign in to manage your leads and conversations</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p>
            Not an admin?{' '}
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
              Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
