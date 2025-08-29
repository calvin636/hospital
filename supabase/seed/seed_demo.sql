-- Demo data for Hospital Concierge SaaS
-- Run this after the main migration

-- Insert demo providers
INSERT INTO providers (id, email, first_name, last_name, title, specialties, license_number, bio, available_hours, hourly_rate) VALUES
(
    '550e8400-e29b-41d4-a716-446655440001',
    'dr.smith@hospital.com',
    'Sarah',
    'Smith',
    'MD',
    ARRAY['Internal Medicine', 'Telehealth'],
    'MD123456',
    'Dr. Smith is an experienced internal medicine physician with over 10 years of experience in telehealth.',
    '{"monday": {"start": "09:00", "end": "17:00"}, "tuesday": {"start": "09:00", "end": "17:00"}, "wednesday": {"start": "09:00", "end": "17:00"}, "thursday": {"start": "09:00", "end": "17:00"}, "friday": {"start": "09:00", "end": "15:00"}}'::jsonb,
    150.00
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    'dr.johnson@hospital.com',
    'Michael',
    'Johnson',
    'MD',
    ARRAY['Cardiology', 'Preventive Care'],
    'MD789012',
    'Dr. Johnson specializes in cardiology and preventive care with a focus on digital health solutions.',
    '{"monday": {"start": "08:00", "end": "16:00"}, "tuesday": {"start": "08:00", "end": "16:00"}, "wednesday": {"start": "08:00", "end": "16:00"}, "thursday": {"start": "08:00", "end": "16:00"}, "friday": {"start": "08:00", "end": "14:00"}}'::jsonb,
    200.00
),
(
    '550e8400-e29b-41d4-a716-446655440003',
    'np.williams@hospital.com',
    'Emily',
    'Williams',
    'NP',
    ARRAY['Family Medicine', 'Urgent Care'],
    'NP345678',
    'Emily is a nurse practitioner specializing in family medicine and urgent care consultations.',
    '{"monday": {"start": "10:00", "end": "18:00"}, "tuesday": {"start": "10:00", "end": "18:00"}, "wednesday": {"start": "10:00", "end": "18:00"}, "thursday": {"start": "10:00", "end": "18:00"}, "friday": {"start": "10:00", "end": "16:00"}, "saturday": {"start": "09:00", "end": "13:00"}}'::jsonb,
    120.00
);

-- Insert demo members (replace UUIDs with actual auth user IDs in production)
INSERT INTO members (id, email, phone, first_name, last_name, date_of_birth, plan, status, stripe_customer_id, subscription_started_at) VALUES
(
    '550e8400-e29b-41d4-a716-446655440010',
    'demo.basic@example.com',
    '+1-555-0101',
    'John',
    'Doe',
    '1985-06-15',
    'basic',
    'active',
    'cus_demo_basic_replace_with_actual_stripe_id',
    NOW() - INTERVAL '30 days'
),
(
    '550e8400-e29b-41d4-a716-446655440011',
    'demo.standard@example.com',
    '+1-555-0102',
    'Jane',
    'Smith',
    '1990-03-22',
    'standard',
    'active',
    'cus_demo_standard_replace_with_actual_stripe_id',
    NOW() - INTERVAL '15 days'
),
(
    '550e8400-e29b-41d4-a716-446655440012',
    'demo.premium@example.com',
    '+1-555-0103',
    'Robert',
    'Johnson',
    '1978-11-08',
    'premium',
    'active',
    'cus_demo_premium_replace_with_actual_stripe_id',
    NOW() - INTERVAL '60 days'
);

-- Insert demo appointments
INSERT INTO appointments (member_id, provider_id, scheduled_at, duration_minutes, status, appointment_type, reason_for_visit, amount_cents) VALUES
(
    '550e8400-e29b-41d4-a716-446655440010',
    '550e8400-e29b-41d4-a716-446655440001',
    NOW() + INTERVAL '2 days',
    30,
    'scheduled',
    'telehealth',
    'Annual checkup consultation',
    5000
),
(
    '550e8400-e29b-41d4-a716-446655440011',
    '550e8400-e29b-41d4-a716-446655440002',
    NOW() + INTERVAL '5 days',
    45,
    'scheduled',
    'telehealth',
    'Cardiology consultation for chest pain',
    7500
),
(
    '550e8400-e29b-41d4-a716-446655440012',
    '550e8400-e29b-41d4-a716-446655440003',
    NOW() - INTERVAL '1 week',
    30,
    'completed',
    'telehealth',
    'Follow-up for hypertension management',
    6000
);

-- Insert demo usage events
INSERT INTO usage_events (member_id, event_type, quantity, metadata) VALUES
(
    '550e8400-e29b-41d4-a716-446655440010',
    'video_minutes',
    30,
    '{"appointment_id": "550e8400-e29b-41d4-a716-446655440020", "provider_id": "550e8400-e29b-41d4-a716-446655440001"}'::jsonb
),
(
    '550e8400-e29b-41d4-a716-446655440010',
    'message_sent',
    5,
    '{"conversation_id": "conv_demo_001"}'::jsonb
),
(
    '550e8400-e29b-41d4-a716-446655440011',
    'video_minutes',
    45,
    '{"appointment_id": "550e8400-e29b-41d4-a716-446655440021", "provider_id": "550e8400-e29b-41d4-a716-446655440002"}'::jsonb
),
(
    '550e8400-e29b-41d4-a716-446655440011',
    'message_sent',
    12,
    '{"conversation_id": "conv_demo_002"}'::jsonb
),
(
    '550e8400-e29b-41d4-a716-446655440012',
    'video_minutes',
    180,
    '{"appointment_id": "550e8400-e29b-41d4-a716-446655440022", "provider_id": "550e8400-e29b-41d4-a716-446655440003"}'::jsonb
),
(
    '550e8400-e29b-41d4-a716-446655440012',
    'message_sent',
    25,
    '{"conversation_id": "conv_demo_003"}'::jsonb
);

-- Insert demo messages
INSERT INTO messages (conversation_id, sender_id, recipient_id, message_type, content) VALUES
(
    uuid_generate_v4(),
    '550e8400-e29b-41d4-a716-446655440010',
    '550e8400-e29b-41d4-a716-446655440001',
    'text',
    'Hi Dr. Smith, I have a question about my upcoming appointment.'
),
(
    uuid_generate_v4(),
    '550e8400-e29b-41d4-a716-446655440011',
    '550e8400-e29b-41d4-a716-446655440002',
    'text',
    'Dr. Johnson, thank you for the consultation yesterday. The chest pain has improved.'
),
(
    uuid_generate_v4(),
    '550e8400-e29b-41d4-a716-446655440012',
    '550e8400-e29b-41d4-a716-446655440003',
    'text',
    'Emily, could you please send me the lab results from last week?'
);

-- Insert demo health records
INSERT INTO health_records (member_id, record_type, title, content, recorded_at, recorded_by) VALUES
(
    '550e8400-e29b-41d4-a716-446655440010',
    'vitals',
    'Annual Physical - Vitals',
    '{"blood_pressure": "120/80", "heart_rate": "72", "temperature": "98.6", "weight": "165", "height": "70"}'::jsonb,
    NOW() - INTERVAL '1 month',
    '550e8400-e29b-41d4-a716-446655440001'
),
(
    '550e8400-e29b-41d4-a716-446655440011',
    'lab_result',
    'Lipid Panel Results',
    '{"total_cholesterol": 185, "ldl": 110, "hdl": 55, "triglycerides": 100, "status": "normal"}'::jsonb,
    NOW() - INTERVAL '2 weeks',
    '550e8400-e29b-41d4-a716-446655440002'
),
(
    '550e8400-e29b-41d4-a716-446655440012',
    'prescription',
    'Hypertension Medication',
    '{"medication": "Lisinopril", "dosage": "10mg", "frequency": "once daily", "duration": "90 days", "refills": 2}'::jsonb,
    NOW() - INTERVAL '1 week',
    '550e8400-e29b-41d4-a716-446655440003'
);

-- Note: In production, replace Stripe customer IDs with actual IDs from your Stripe account
-- Also replace the member UUIDs with actual auth user IDs from Supabase Auth
