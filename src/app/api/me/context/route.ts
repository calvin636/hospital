// Get member context API route
import { NextRequest, NextResponse } from 'next/server'
import { getMemberContext } from '@/lib/memberContext'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const context = await getMemberContext(user.id)
    
    if (!context) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }
    
    return NextResponse.json(context)
  } catch (error) {
    console.error('Error fetching member context:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
