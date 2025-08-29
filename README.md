# Hospital Concierge SaaS Platform

A comprehensive healthcare SaaS platform built with Next.js, Supabase, Stripe, and Agora. Features policy-driven multi-tenant architecture with telehealth capabilities.

## 🏥 Features

- **Multi-tenant Policy Engine**: JSON-driven policies for Basic, Standard, Premium, and Plus plans
- **Telehealth Integration**: Video consultations powered by Agora RTC
- **Usage Metering**: Track video minutes, messages, appointments with real-time limits
- **Subscription Management**: Stripe integration for billing and plan management
- **Healthcare Records**: HIPAA-compliant patient data management
- **Provider Portal**: Appointment scheduling and patient management
- **Real-time Communication**: Chat and messaging system

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Setup

Copy the environment template:
```bash
cp .env.example .env.local
```

Fill in your environment variables:
- **Supabase**: Project URL, anon key, and service role key
- **Stripe**: Secret key, webhook secret, and publishable key  
- **Agora**: App ID and certificate for video calls

### 3. Database Setup

1. Create a new Supabase project
2. Run the migration:
   ```sql
   -- Copy and paste contents of supabase/migrations/001_init.sql
   ```
3. Seed demo data:
   ```sql
   -- Copy and paste contents of supabase/seed/seed_demo.sql
   ```

### 4. Stripe Configuration

1. Create 4 products/prices in Stripe for Basic ($29), Standard ($79), Premium ($149), Plus ($299)
2. Update the Stripe customer IDs in the seed data
3. Set up webhook endpoint: `/api/billing/webhook`

### 5. Run Development Server

```bash
pnpm dev
```

## 📁 Project Structure

```
hospital/
├── policies/              # JSON policy definitions
│   ├── basic.json         # Basic plan ($29/month)
│   ├── standard.json      # Standard plan ($79/month)  
│   ├── premium.json       # Premium plan ($149/month)
│   └── plus.json          # Plus plan ($299/month)
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── api/           # API routes
│   │   ├── patient/       # Patient dashboard
│   │   └── pricing/       # Pricing page
│   └── lib/               # Shared utilities
│       ├── components/    # React components
│       ├── api/           # API client & hooks
│       ├── auth.ts        # Authentication
│       ├── db.ts          # Supabase client
│       └── memberContext.ts # Policy engine
├── supabase/
│   ├── migrations/        # Database schema
│   └── seed/              # Demo data
└── scripts/               # Utility scripts
```

## 🔧 API Endpoints

- `GET /api/me/context` - Get member profile and plan
- `GET /api/me/policy` - Get current policy configuration  
- `GET /api/me/meters` - Get usage meters and limits
- `POST /api/me/video/start` - Start video session
- `POST /api/me/visit/book` - Book appointment
- `POST /api/billing/webhook` - Stripe webhook handler

## 🏗️ Policy Engine

The platform uses JSON-based policies to drive features and limits:

```typescript
// Example policy enforcement
const policy = getPolicyForPlan(member.plan)
const canStartVideo = canPerformAction(policy, 'start_video', currentUsage)
```

Each policy defines:
- Feature availability and limits
- SLA guarantees  
- Support levels
- Usage restrictions

## 🎥 Video Integration

Agora RTC integration for telehealth:
- Token-based authentication
- Real-time video/audio
- Screen sharing capabilities
- Usage tracking and billing

## 💳 Billing & Subscriptions

- Stripe subscription management
- Usage-based billing
- Plan upgrades/downgrades
- Webhook handling for billing events

## 🔒 Security & Compliance

- Row Level Security (RLS) in Supabase
- HIPAA-compliant data handling
- Encrypted health records
- Audit trail for all actions

## 📊 Database Schema

Key tables:
- `members` - User accounts and subscription info
- `providers` - Healthcare providers  
- `appointments` - Scheduled visits
- `usage_events` - Metering and billing
- `health_records` - Patient medical data
- `care_links` - Family/caregiver connections

## 🚀 Deployment

### Vercel Deployment

1. Import repo to Vercel
2. Add all environment variables
3. Deploy

### Manual Deployment

```bash
pnpm build
pnpm start
```

## 🧪 Testing

```bash
# Test API endpoints
curl http://localhost:3000/api/me/context

# Test video session
curl -X POST http://localhost:3000/api/me/video/start

# Test usage meters  
curl http://localhost:3000/api/me/meters
```

## 📝 Development Notes

- Uses Next.js 14 App Router
- TypeScript throughout
- Tailwind CSS for styling
- Policy-as-data architecture
- Real-time capabilities with Supabase
- Multi-tenant by design

## 🆘 Support

For questions or issues:
1. Check the API documentation in `openapi.yaml`
2. Review policy configurations in `policies/` 
3. Examine database schema in `supabase/migrations/`

## 📄 License

This project is part of a healthcare SaaS starter template.