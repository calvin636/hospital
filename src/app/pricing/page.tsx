// Pricing page
import Link from 'next/link'

const plans = [
  {
    name: 'Basic',
    price: 29,
    description: 'Essential healthcare access',
    features: [
      '2 video consultations per month',
      '24h response time',
      'Basic health records',
      'Email support',
      '1GB storage'
    ],
    cta: 'Start Basic'
  },
  {
    name: 'Standard',
    price: 79,
    description: 'Comprehensive healthcare management',
    features: [
      '8 video consultations per month',
      '4h response time',
      'Enhanced health records',
      'Email & chat support',
      '5GB storage',
      'Priority scheduling'
    ],
    cta: 'Choose Standard',
    popular: true
  },
  {
    name: 'Premium',
    price: 149,
    description: 'Advanced healthcare with specialist access',
    features: [
      'Unlimited video consultations',
      '1h response time',
      'Premium health records with analytics',
      'Email, chat & phone support',
      '50GB storage',
      'Specialist access',
      'Emergency booking'
    ],
    cta: 'Go Premium'
  },
  {
    name: 'Plus',
    price: 299,
    description: 'Enterprise healthcare solution',
    features: [
      'Everything in Premium',
      '15min response time',
      'Unlimited storage',
      'Dedicated support line',
      '24/7 emergency consults',
      'API access',
      'White-label options'
    ],
    cta: 'Contact Sales'
  }
]

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Healthcare Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Flexible plans designed to scale with your healthcare needs. 
            All plans include our core telehealth platform and security features.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-lg shadow-sm border-2 p-8 relative ${
                plan.popular ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {plan.description}
                </p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600">/month</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I upgrade or downgrade my plan?
              </h3>
              <p className="text-gray-600">
                Yes, you can change your plan at any time. Changes take effect immediately, 
                and you'll be prorated for any price differences.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens if I exceed my plan limits?
              </h3>
              <p className="text-gray-600">
                Our policy engine will notify you when you're approaching limits. 
                You can upgrade or purchase additional usage as needed.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is my health data secure?
              </h3>
              <p className="text-gray-600">
                Absolutely. We're HIPAA compliant and use enterprise-grade encryption 
                to protect your health information.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-blue-600 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to transform your healthcare experience?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join thousands of patients who trust our platform for their healthcare needs.
          </p>
          <Link
            href="/patient/dashboard"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors inline-block"
          >
            Get Started Today
          </Link>
        </div>
      </div>
    </div>
  )
}
