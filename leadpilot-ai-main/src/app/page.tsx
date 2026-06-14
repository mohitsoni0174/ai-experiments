'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            LeadPilot AI
          </div>
          <div className="flex gap-4 items-center">
            <Link href="#features" className="text-gray-600 hover:text-gray-900">Features</Link>
            <Link href="#testimonials" className="text-gray-600 hover:text-gray-900">Testimonials</Link>
            <Link href="/admin/login">
              <Button variant="outline" size="sm">Admin</Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="sm">Sign In</Button>
            </Link>
          </div>
        </div>
      </nav>

                        LeadPilot AI

      <section className="flex-1 flex items-center justify-center pt-20 pb-12 px-4 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="text-center max-w-4xl">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
            AI-Powered Chat Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Seamless conversations powered by cutting-edge AI. Get instant responses, manage conversations, and grow your business with our intelligent chat platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                Get Started Free
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Trusted by teams mini strip */}
      <div className="w-full bg-white py-4 border-b border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <div className="text-sm font-semibold text-gray-500 mb-2">Trusted by founders, agencies & sales teams</div>
          <div className="flex gap-8 justify-center items-center">
            {['NovaCRM', 'Growthly', 'SalesFlow', 'SupportPro', 'Leadify'].map((logo) => (
              <span key={logo} className="px-4 py-2 rounded bg-gray-100 text-gray-400 font-bold text-base tracking-wide border border-gray-200 shadow-sm" style={{minWidth: 90, textAlign: 'center'}}>{logo}</span>
            ))}
          </div>
        </div>
      </div>



      {/* Use Cases Section */}
      <section id="use-cases" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-900" style={{textShadow: '0 1px 2px #fff, 0 2px 8px #cbd5e1'}}>Use Cases</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card: Customer Support */}
            <div className="p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition bg-white">
              <h3 className="text-xl font-bold mb-2 text-gray-800">Customer Support</h3>
              <p className="text-gray-700">Deliver instant, helpful answers to your customers 24/7 and resolve issues faster with AI-powered chat.</p>
            </div>
            {/* Card: Lead Generation */}
            <div className="p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition bg-white">
              <h3 className="text-xl font-bold mb-2 text-gray-800">Lead Generation</h3>
              <p className="text-gray-700">Capture and qualify leads automatically, turning website visitors into sales opportunities with smart conversations.</p>
            </div>
            {/* Card: Appointment Booking */}
            <div className="p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition bg-white">
              <h3 className="text-xl font-bold mb-2 text-gray-800">Appointment Booking</h3>
              <p className="text-gray-700">Let customers book meetings, demos, or calls directly in chat—no manual scheduling required.</p>
            </div>
            {/* Card: FAQ Automation */}
            <div className="p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition bg-white">
              <h3 className="text-xl font-bold mb-2 text-gray-800">FAQ Automation</h3>
              <p className="text-gray-700">Automate answers to common questions and reduce support workload with intelligent FAQ handling.</p>
            </div>
            {/* Card: Sales Assistant */}
            <div className="p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition bg-white">
              <h3 className="text-xl font-bold mb-2 text-gray-800">Sales Assistant</h3>
              <p className="text-gray-700">Guide buyers, recommend products, and close deals faster with a proactive AI sales assistant.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-900">Pricing & Plans</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="p-8 rounded-lg border border-gray-200 shadow-sm bg-white flex flex-col items-center">
              <h3 className="text-2xl font-bold mb-2 text-gray-800">Starter</h3>
              <ul className="mb-6 text-gray-700 space-y-2 text-center">
                <li>Basic chatbot</li>
                <li>100 chats/month</li>
                <li>Email support</li>
              </ul>
              <Button className="w-full bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold">Start Starter</Button>
            </div>
            {/* Pro Plan (highlighted) */}
            <div className="p-8 rounded-lg border-2 border-blue-600 shadow-lg bg-white flex flex-col items-center relative">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">Most Popular</div>
              <h3 className="text-2xl font-bold mb-2 text-blue-700">Pro</h3>
              <ul className="mb-6 text-gray-700 space-y-2 text-center">
                <li>Unlimited chats</li>
                <li>Lead capture</li>
                <li>Admin dashboard</li>
              </ul>
              <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 font-semibold">Choose Pro</Button>
            </div>
            {/* Business Plan */}
            <div className="p-8 rounded-lg border border-gray-200 shadow-sm bg-white flex flex-col items-center">
              <h3 className="text-2xl font-bold mb-2 text-gray-800">Business</h3>
              <ul className="mb-6 text-gray-700 space-y-2 text-center">
                <li>Team access</li>
                <li>Export CSV</li>
                <li>Custom training</li>
              </ul>
              <Button className="w-full bg-gray-900 text-white hover:bg-gray-800 font-semibold">Contact Sales</Button>
            </div>
          </div>
        </div>
      </section>
      

        {/* FAQ Section */}
        <section className="w-full py-20 px-4 bg-white flex justify-center items-center">
          <div className="max-w-3xl w-full mx-auto px-6 py-12 rounded-2xl">
            <h2 className="text-3xl font-bold mb-10 text-center text-gray-900">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Is this chatbot trainable?</h3>
                <p className="text-gray-600">Yes, you can train the chatbot with your own FAQs, documents, or knowledge base to provide tailored responses for your business.</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Can I embed it on any website?</h3>
                <p className="text-gray-600">Absolutely! Our chat widget can be easily embedded on any website with a simple code snippet.</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Does it support lead capture?</h3>
                <p className="text-gray-600">Yes, the chatbot can capture leads and collect user information directly within the chat experience.</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Can I export leads?</h3>
                <p className="text-gray-600">You can export all captured leads in CSV format for easy integration with your CRM or sales tools.</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Do you offer custom setup?</h3>
                <p className="text-gray-600">We offer custom setup and onboarding to ensure the chatbot fits your unique business needs. Contact us for details.</p>
              </div>
            </div>
          </div>
        </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="pt-8 pb-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center mb-10 text-black">Trusted by Growing Teams</h2>
          {/* If you add a subtitle, use: <p className=\"text-xl text-slate-600 dark:text-slate-300 text-center mb-8\">Subtitle here</p> */}
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">\"{testimonial.text}\"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pt-12 pb-16 px-4 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who are already using our AI chat platform
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Tech Stack Section */}
          <div className="mb-8 text-center">
            <div className="inline-block bg-gray-800 rounded-full px-6 py-3 text-sm font-semibold text-gray-200 tracking-wide shadow">
              Tech Stack: Next.js &nbsp;|&nbsp; Node.js &nbsp;|&nbsp; Supabase &nbsp;|&nbsp; Ollama (Qwen2.5) &nbsp;|&nbsp; Vercel
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm opacity-70">
                <li><a href="#" className="hover:opacity-100">Features</a></li>
                <li><a href="#" className="hover:opacity-100">Pricing</a></li>
                <li><a href="#" className="hover:opacity-100">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm opacity-70">
                <li><a href="#" className="hover:opacity-100">About</a></li>
                <li><a href="#" className="hover:opacity-100">Blog</a></li>
                <li><a href="#" className="hover:opacity-100">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm opacity-70">
                <li><a href="#" className="hover:opacity-100">Docs</a></li>
                <li><a href="#" className="hover:opacity-100">Support</a></li>
                <li><a href="#" className="hover:opacity-100">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm opacity-70">
                <li><a href="#" className="hover:opacity-100">Privacy</a></li>
                <li><a href="#" className="hover:opacity-100">Terms</a></li>
                <li><a href="#" className="hover:opacity-100">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm opacity-50">
            <p>&copy; 2024 LeadPilot AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

const testimonials = [
  {
    rating: 5,
    text: "This AI chat solution increased our lead conversion by 40% in just 3 months. The intelligent qualification questions save us hours every week!",
    author: "Sarah Chen",
    company: "TechVentures Inc"
  },
  {
    rating: 5,
    text: "The admin dashboard gives us complete visibility into customer conversations. The lead scoring feature is absolutely game-changing for our sales team.",
    author: "Marcus Johnson",
    company: "Growth Agency"
  },
  {
    rating: 5,
    text: "Implementation was seamless, and the AI intent detection is spot-on. We've automated 70% of our customer support inquiries.",
    author: "Elena Rodriguez",
    company: "Digital Solutions Co"
  }
]

const features = [
  {
    icon: '💬',
    title: 'Real-time Chat',
    description: 'Instant messaging with lightning-fast response times powered by advanced AI models.',
  },
  {
    icon: '🤖',
    title: 'AI Responses',
    description: 'Get intelligent, context-aware responses tailored to your needs.',
  },
  {
    icon: '📊',
    title: 'Analytics',
    description: 'Track conversations, analyze patterns, and gain valuable insights.',
  },
  {
    icon: '🔒',
    title: 'Secure',
    description: 'Enterprise-grade security with end-to-end encryption.',
  },
  {
    icon: '⚡',
    title: 'Fast',
    description: 'Lightning-quick performance with global CDN coverage.',
  },
  {
    icon: '🔧',
    title: 'Customizable',
    description: 'Customize every aspect to match your brand and requirements.',
  },
]
