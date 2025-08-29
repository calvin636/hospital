'use client'

// Patient dashboard page
import { useState } from 'react'
import { useMemberContext, useMemberPolicy, useUsageMeters } from '@/lib/api/hooks'
import { Meter } from '@/lib/components/Meter'
import { SLAChip } from '@/lib/components/SLAChip'
import { VideoRoom } from '@/lib/components/telehealth/VideoRoom'

export default function PatientDashboard() {
  const { context, loading: contextLoading } = useMemberContext()
  const { policy, loading: policyLoading } = useMemberPolicy()
  const { meters, loading: metersLoading, refetch: refetchMeters } = useUsageMeters()
  const [videoSession, setVideoSession] = useState<any>(null)
  const [showVideo, setShowVideo] = useState(false)

  const startVideoCall = async () => {
    try {
      const response = await fetch('/api/me/video/start', {
        method: 'POST',
      })
      const session = await response.json()
      setVideoSession(session)
      setShowVideo(true)
    } catch (error) {
      console.error('Failed to start video call:', error)
    }
  }

  const endVideoCall = () => {
    setShowVideo(false)
    setVideoSession(null)
    refetchMeters() // Refresh usage after video call
  }

  if (contextLoading || policyLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {context?.firstName || 'Patient'}
              </h1>
              <p className="text-gray-600 mt-1">
                {context?.email} • {policy?.name} Plan
              </p>
            </div>
            <div className="text-right">
              {policy && (
                <SLAChip
                  availability={policy.sla.availability}
                  responseTime={policy.sla.responseTime}
                  supportLevel={policy.sla.supportLevel}
                />
              )}
            </div>
          </div>
        </div>

        {/* Video Call Modal */}
        {showVideo && videoSession && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="max-w-4xl w-full">
              <VideoRoom
                channelName={videoSession.channelName}
                token={videoSession.token}
                uid={videoSession.uid}
                onLeave={endVideoCall}
              />
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={startVideoCall}
            className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition-colors text-left"
          >
            <div className="text-3xl mb-2">📹</div>
            <h3 className="text-lg font-semibold">Start Video Call</h3>
            <p className="text-blue-100 text-sm">Connect with a provider instantly</p>
          </button>

          <button className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition-colors text-left">
            <div className="text-3xl mb-2">📅</div>
            <h3 className="text-lg font-semibold">Book Appointment</h3>
            <p className="text-green-100 text-sm">Schedule your next visit</p>
          </button>

          <button className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition-colors text-left">
            <div className="text-3xl mb-2">💬</div>
            <h3 className="text-lg font-semibold">Send Message</h3>
            <p className="text-purple-100 text-sm">Chat with your care team</p>
          </button>
        </div>

        {/* Usage Meters */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Usage This Month</h2>
          
          {metersLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading usage data...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {meters.map((meter, index) => (
                <Meter key={index} meter={meter} />
              ))}
            </div>
          )}
        </div>

        {/* Plan Details */}
        {policy && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {policy.name} Plan Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Telehealth</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Video consultations: {policy.features.telehealth.videoConsults.limit === 'unlimited' ? 'Unlimited' : `${policy.features.telehealth.videoConsults.limit} per month`}</li>
                  <li>• Response time: {policy.features.telehealth.messagingSupport.responseTime}</li>
                  {policy.features.telehealth.specialistAccess && (
                    <li>• Specialist access: {policy.features.telehealth.specialistAccess.waitTime}</li>
                  )}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Level: {policy.sla.supportLevel}</li>
                  <li>• Channels: {policy.features.support.channels.join(', ')}</li>
                  <li>• Availability: {policy.sla.availability}</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
