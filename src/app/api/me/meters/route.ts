// Get member usage meters API route
import { NextRequest, NextResponse } from 'next/server'
import { getMemberUsage } from '@/lib/memberContext'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const meters = await getMemberUsage(user.id)
    
    return NextResponse.json(meters)
  } catch (error) {
    console.error('Error fetching usage meters:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
