#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seedDemo() {
  console.log('🌱 Starting demo data seeding...')
  
  try {
    // Check if we already have demo data
    const { data: existingMembers } = await supabase
      .from('members')
      .select('id')
      .limit(1)
    
    if (existingMembers && existingMembers.length > 0) {
      console.log('Demo data already exists. Skipping seed.')
      return
    }
    
    // You can add more seeding logic here
    // For now, the SQL seed file handles the main seeding
    
    console.log('✅ Demo seeding completed!')
    console.log('Next steps:')
    console.log('1. Run the SQL seed file in Supabase Studio')
    console.log('2. Update Stripe customer IDs in the seed data')
    console.log('3. Test the API endpoints')
    
  } catch (error) {
    console.error('❌ Error seeding demo data:', error)
    process.exit(1)
  }
}

seedDemo()
