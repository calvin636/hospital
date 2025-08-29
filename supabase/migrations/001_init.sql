-- Hospital Concierge SaaS Database Schema
-- Version: 1.0
-- Date: 2025-08-29

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE member_status AS ENUM ('active', 'inactive', 'suspended', 'trial');
CREATE TYPE plan_type AS ENUM ('basic', 'standard', 'premium', 'plus');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');
CREATE TYPE message_type AS ENUM ('text', 'image', 'file', 'system');
CREATE TYPE care_link_status AS ENUM ('pending', 'active', 'revoked');

-- Members table (core user data)
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    plan plan_type NOT NULL DEFAULT 'basic',
    status member_status NOT NULL DEFAULT 'trial',
    stripe_customer_id VARCHAR(255),
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    subscription_started_at TIMESTAMP WITH TIME ZONE,
    subscription_ends_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Healthcare providers table
CREATE TABLE providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    title VARCHAR(100), -- Dr., NP, PA, etc.
    specialties TEXT[], -- array of specialties
    license_number VARCHAR(100),
    bio TEXT,
    available_hours JSONB, -- schedule data
    hourly_rate DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE RESTRICT,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    status appointment_status NOT NULL DEFAULT 'scheduled',
    appointment_type VARCHAR(50) NOT NULL, -- 'telehealth', 'in_person', 'phone'
    reason_for_visit TEXT,
    notes TEXT,
    agora_channel_name VARCHAR(255), -- for video calls
    stripe_payment_intent_id VARCHAR(255),
    amount_cents INTEGER, -- cost in cents
    completed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table (for chat/communication)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL, -- groups messages together
    sender_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    recipient_id UUID, -- NULL for group messages
    message_type message_type NOT NULL DEFAULT 'text',
    content TEXT NOT NULL,
    attachment_url TEXT,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage events table (for metering/billing)
CREATE TABLE usage_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'video_minutes', 'message_sent', 'appointment_booked'
    quantity INTEGER NOT NULL DEFAULT 1,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Care links table (family/care team connections)
CREATE TABLE care_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    primary_member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    linked_member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    relationship VARCHAR(50), -- 'spouse', 'child', 'parent', 'caregiver'
    permissions JSONB DEFAULT '{}'::jsonb, -- what linked member can access
    status care_link_status NOT NULL DEFAULT 'pending',
    invited_by UUID REFERENCES members(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(primary_member_id, linked_member_id)
);

-- Member transfers table (for plan changes, cancellations)
CREATE TABLE member_transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    from_plan plan_type,
    to_plan plan_type,
    from_status member_status,
    to_status member_status,
    reason VARCHAR(255),
    effective_date TIMESTAMP WITH TIME ZONE NOT NULL,
    processed_by UUID, -- admin user id if applicable
    stripe_subscription_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health records table
CREATE TABLE health_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    record_type VARCHAR(50) NOT NULL, -- 'vitals', 'lab_result', 'prescription', 'note'
    title VARCHAR(255) NOT NULL,
    content JSONB NOT NULL,
    file_url TEXT,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    recorded_by UUID REFERENCES providers(id),
    is_shared BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Billing events table
CREATE TABLE billing_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    stripe_event_id VARCHAR(255) UNIQUE,
    event_type VARCHAR(100) NOT NULL,
    amount_cents INTEGER,
    currency VARCHAR(3) DEFAULT 'usd',
    description TEXT,
    invoice_url TEXT,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for performance
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_plan ON members(plan);
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_members_stripe_customer ON members(stripe_customer_id);

CREATE INDEX idx_appointments_member_id ON appointments(member_id);
CREATE INDEX idx_appointments_provider_id ON appointments(provider_id);
CREATE INDEX idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX idx_appointments_status ON appointments(status);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

CREATE INDEX idx_usage_events_member_id ON usage_events(member_id);
CREATE INDEX idx_usage_events_type ON usage_events(event_type);
CREATE INDEX idx_usage_events_created_at ON usage_events(created_at);

CREATE INDEX idx_care_links_primary_member ON care_links(primary_member_id);
CREATE INDEX idx_care_links_linked_member ON care_links(linked_member_id);

CREATE INDEX idx_health_records_member_id ON health_records(member_id);
CREATE INDEX idx_health_records_type ON health_records(record_type);
CREATE INDEX idx_health_records_recorded_at ON health_records(recorded_at);

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_care_links_updated_at BEFORE UPDATE ON care_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_health_records_updated_at BEFORE UPDATE ON health_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (members can only see their own data)
CREATE POLICY "Members can view own data" ON members FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Members can update own data" ON members FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Members can view own appointments" ON appointments FOR SELECT USING (auth.uid()::text = member_id::text);
CREATE POLICY "Members can view own messages" ON messages FOR SELECT USING (auth.uid()::text = sender_id::text);
CREATE POLICY "Members can view own usage" ON usage_events FOR SELECT USING (auth.uid()::text = member_id::text);
CREATE POLICY "Members can view own care links" ON care_links FOR SELECT USING (auth.uid()::text = primary_member_id::text OR auth.uid()::text = linked_member_id::text);
CREATE POLICY "Members can view own health records" ON health_records FOR SELECT USING (auth.uid()::text = member_id::text);
