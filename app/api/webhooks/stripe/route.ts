// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/prisma'

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.error('Webhook Error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const userId = session.metadata?.userId
    const serviceId = session.metadata?.serviceId
    const date = session.metadata?.date
    const stripeSessionId = session.id

    if (!userId || !serviceId || !date) {
      console.error('Missing metadata')
      return NextResponse.json({}, { status: 400 })
    }

    // Prevent duplicate booking
    const existing = await db.booking.findFirst({
      where: { stripeSessionId },
    })

    if (!existing) {
      await db.booking.create({
        data: {
          userId,
          serviceId,
          date: new Date(date),
          stripeSessionId,
          status: 'CONFIRMED',
        },
      })
    }
  }

  return NextResponse.json({ received: true })
}
