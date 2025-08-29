// Book appointment API route
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { providerId, datetime, reason } = body
    
    if (!providerId || !datetime) {
      return NextResponse.json(
        { error: 'Provider ID and datetime are required' },
        { status: 400 }
      )
    }
    
    // Create appointment
    const { data: appointment, error } = await supabaseAdmin
      .from('appointments')
      .insert({
        member_id: user.id,
        provider_id: providerId,
        scheduled_at: datetime,
        reason_for_visit: reason,
        appointment_type: 'telehealth',
        status: 'scheduled'
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating appointment:', error)
      return NextResponse.json(
        { error: 'Failed to book appointment' },
        { status: 500 }
      )
    }
    
    // Log usage event
    await supabaseAdmin
      .from('usage_events')
      .insert({
        member_id: user.id,
        event_type: 'appointment_booked',
        quantity: 1,
        metadata: { appointment_id: appointment.id }
      })
    
    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Error booking appointment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
