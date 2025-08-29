// Member context utilities - get member data and policy
import { supabase } from './db'
import basicPolicy from '../../policies/basic.json'
import standardPolicy from '../../policies/standard.json'
import premiumPolicy from '../../policies/premium.json'
import plusPolicy from '../../policies/plus.json'

export interface MemberContext {
  id: string
  email: string
  plan: 'basic' | 'standard' | 'premium' | 'plus'
  status: 'active' | 'inactive' | 'suspended' | 'trial'
  firstName?: string
  lastName?: string
  subscriptionStartedAt?: string
  subscriptionEndsAt?: string
}

export interface PolicyDocument {
  name: string
  version: string
  description: string
  pricing: {
    monthly: number
    annual: number
  }
  features: Record<string, any>
  limits: Record<string, any>
  sla: Record<string, any>
  restrictions: Record<string, any>
}

export interface UsageMeter {
  name: string
  used: number
  limit: number | 'unlimited'
  unit: string
  percentage: number
}

const policyMap: Record<string, PolicyDocument> = {
  basic: basicPolicy,
  standard: standardPolicy,
  premium: premiumPolicy,
  plus: plusPolicy
}

export async function getMemberContext(userId: string): Promise<MemberContext | null> {
  const { data: member, error } = await supabase
    .from('members')
    .select('*')
    .eq('id', userId)
    .single()

  if (error || !member) {
    return null
  }

  return {
    id: member.id,
    email: member.email,
    plan: member.plan,
    status: member.status,
    firstName: member.first_name,
    lastName: member.last_name,
    subscriptionStartedAt: member.subscription_started_at,
    subscriptionEndsAt: member.subscription_ends_at
  }
}

export function getPolicyForPlan(plan: string): PolicyDocument {
  return policyMap[plan] || policyMap.basic
}

export async function getMemberUsage(userId: string): Promise<UsageMeter[]> {
  const member = await getMemberContext(userId)
  if (!member) return []

  const policy = getPolicyForPlan(member.plan)
  
  // Get usage events for current month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { data: usageEvents } = await supabase
    .from('usage_events')
    .select('event_type, quantity')
    .eq('member_id', userId)
    .gte('created_at', startOfMonth.toISOString())

  // Aggregate usage by type
  const usage: Record<string, number> = {}
  usageEvents?.forEach(event => {
    usage[event.event_type] = (usage[event.event_type] || 0) + event.quantity
  })

  // Create meters based on policy limits
  const meters: UsageMeter[] = []
  
  // Video minutes meter
  if (policy.limits.videoMinutes) {
    const used = usage.video_minutes || 0
    const limit = policy.limits.videoMinutes === 'unlimited' ? 'unlimited' : policy.limits.videoMinutes
    meters.push({
      name: 'Video Minutes',
      used,
      limit,
      unit: 'minutes',
      percentage: limit === 'unlimited' ? 0 : Math.min((used / limit) * 100, 100)
    })
  }

  // Messages meter
  if (policy.limits.messages) {
    const used = usage.message_sent || 0
    const limit = policy.limits.messages === 'unlimited' ? 'unlimited' : policy.limits.messages
    meters.push({
      name: 'Messages',
      used,
      limit,
      unit: 'messages',
      percentage: limit === 'unlimited' ? 0 : Math.min((used / limit) * 100, 100)
    })
  }

  // Appointments meter
  if (policy.limits.appointments) {
    const used = usage.appointment_booked || 0
    const limit = policy.limits.appointments === 'unlimited' ? 'unlimited' : policy.limits.appointments
    meters.push({
      name: 'Appointments',
      used,
      limit,
      unit: 'appointments',
      percentage: limit === 'unlimited' ? 0 : Math.min((used / limit) * 100, 100)
    })
  }

  return meters
}

export function canPerformAction(policy: PolicyDocument, action: string, currentUsage?: number): boolean {
  // Simple policy enforcement examples
  switch (action) {
    case 'book_appointment':
      if (policy.limits.appointments === 'unlimited') return true
      return (currentUsage || 0) < policy.limits.appointments
    
    case 'send_message':
      if (policy.limits.messages === 'unlimited') return true
      return (currentUsage || 0) < policy.limits.messages
    
    case 'start_video':
      if (policy.limits.videoMinutes === 'unlimited') return true
      return (currentUsage || 0) < policy.limits.videoMinutes
    
    default:
      return true
  }
}
