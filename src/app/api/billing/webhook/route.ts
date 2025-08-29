// Stripe webhook handler
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!
    
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
    
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription)
        break
        
      case 'customer.subscription.deleted':
        await handleSubscriptionCancellation(event.data.object as Stripe.Subscription)
        break
        
      case 'invoice.payment_succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.Invoice)
        break
        
      case 'invoice.payment_failed':
        await handlePaymentFailure(event.data.object as Stripe.Invoice)
        break
        
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
    
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  // Update member plan based on subscription
  console.log('Subscription changed:', subscription.id)
  // TODO: Implement subscription update logic
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  // Handle subscription cancellation
  console.log('Subscription cancelled:', subscription.id)
  // TODO: Implement cancellation logic
}

async function handlePaymentSuccess(invoice: Stripe.Invoice) {
  // Handle successful payment
  console.log('Payment succeeded:', invoice.id)
  // TODO: Implement payment success logic
}

async function handlePaymentFailure(invoice: Stripe.Invoice) {
  // Handle failed payment
  console.log('Payment failed:', invoice.id)
  // TODO: Implement payment failure logic
}
