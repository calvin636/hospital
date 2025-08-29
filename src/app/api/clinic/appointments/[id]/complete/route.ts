// Complete appointment API route (for providers)
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const appointmentId = params.id
    const body = await request.json()
    const { notes, diagnosis } = body
    
    // Update appointment status
    const { data: appointment, error } = await supabaseAdmin
      .from('appointments')
      .update({
        status: 'completed',
        notes,
        completed_at: new Date().toISOString()
      })
      .eq('id', appointmentId)
      .select()
      .single()
    
    if (error) {
      console.error('Error completing appointment:', error)
      return NextResponse.json(
        { error: 'Failed to complete appointment' },
        { status: 500 }
      )
    }
    
    // Create health record if diagnosis provided
    if (diagnosis) {
      await supabaseAdmin
        .from('health_records')
        .insert({
          member_id: appointment.member_id,
          record_type: 'note',
          title: 'Appointment Summary',
          content: { diagnosis, notes },
          recorded_at: new Date().toISOString(),
          recorded_by: user.id
        })
    }
    
    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Error completing appointment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
