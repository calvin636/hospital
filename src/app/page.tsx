// Main landing page
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">🏥 Hospital Concierge</h1>
            </div>
            <nav className="flex space-x-8">
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </Link>
              <Link href="/patient/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Dashboard
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <main className="py-16">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 sm:text-6xl">
              Healthcare that
              <span className="text-blue-600"> adapts to you</span>
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Get personalized healthcare with our policy-driven platform. 
              From basic care to enterprise solutions, we scale with your needs.
            </p>
            
            <div className="mt-10 flex justify-center gap-4">
              <Link 
                href="/patient/dashboard"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
              <Link 
                href="/pricing"
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors"
              >
                View Plans
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                📹
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Telehealth</h3>
              <p className="text-gray-600">
                Video consultations with licensed providers, available 24/7 for Premium+ plans.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                📊
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Policies</h3>
              <p className="text-gray-600">
                AI-driven policy engine that automatically enforces limits and permissions.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                🏆
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Enterprise Ready</h3>
              <p className="text-gray-600">
                White-label solutions with custom integrations and dedicated support.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
