'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface LeadDetail {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  budget?: string
  timeline?: string
  requirement?: string
  lead_score: number
  status: string
  notes?: string
  created_at: string
  conversation_id?: string
}

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [supabase, setSupabase] = useState<any>(null)
  const [lead, setLead] = useState<LeadDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('')
  const [isSaving, setIsSaving] = useState(false)

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

        // Load lead details - in real app would call API
        const leadData: LeadDetail = {
          id: params.id,
          name: 'Alice Johnson',
          email: 'alice@techcorp.com',
          phone: '+1 (555) 123-4567',
          company: 'TechCorp Inc',
          budget: '$50,000 - $100,000',
          timeline: 'Q2 2024',
          requirement: 'Enterprise plan with custom features',
          lead_score: 92,
          status: 'qualified',
          notes: 'Strong interest in enterprise features. Mentioned budget alignment.',
          created_at: new Date().toISOString(),
          conversation_id: 'conv-123',
        }
        setLead(leadData)
        setNotes(leadData.notes || '')
        setStatus(leadData.status)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndLoadData()
  }, [router, params.id])

  async function handleSave() {
    setIsSaving(true)
    try {
      // In real app would call API to save changes
      if (lead) {
        setLead({
          ...lead,
          notes,
          status,
        })
      }
      alert('Lead updated successfully')
    } catch (error) {
      console.error('Error saving:', error)
      alert('Failed to save lead')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/leads">
            <Button variant="ghost">← Back</Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Lead Details</h1>
            <p className="text-slate-600 text-sm">{params.id}</p>
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
          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-slate-600">Loading lead...</div>
            </div>
          ) : lead ? (
            <div className="grid grid-cols-3 gap-6">
              {/* Contact Info */}
              <div className="col-span-2 space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-slate-600">Name</label>
                      <p className="text-slate-900 font-medium">{lead.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-600">Email</label>
                      <p className="text-slate-900 font-medium">
                        <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">
                          {lead.email}
                        </a>
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-600">Phone</label>
                      <p className="text-slate-900 font-medium">{lead.phone || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-600">Company</label>
                      <p className="text-slate-900 font-medium">{lead.company || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Qualification Info */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Qualification</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-slate-600">Budget</label>
                      <p className="text-slate-900 font-medium">{lead.budget || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-600">Timeline</label>
                      <p className="text-slate-900 font-medium">{lead.timeline || '-'}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm text-slate-600">Requirements</label>
                      <p className="text-slate-900 font-medium">{lead.requirement || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Notes</h2>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add internal notes about this lead..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
                  />
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Lead Status</h3>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Lead Score</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div
                          className="bg-green-600 h-3 rounded-full transition-all"
                          style={{ width: `${lead.lead_score}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xl font-bold text-slate-900">{lead.lead_score}</span>
                  </div>
                </div>

                {lead.conversation_id && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="font-semibold text-slate-900 mb-4">Related Conversation</h3>
                    <Link href={`/admin/conversations/${lead.conversation_id}`}>
                      <Button variant="outline" className="w-full">
                        View Conversation
                      </Button>
                    </Link>
                  </div>
                )}

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="font-semibold text-slate-900 mb-2 text-sm">Created</h3>
                  <p className="text-slate-600 text-sm">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  )
}
