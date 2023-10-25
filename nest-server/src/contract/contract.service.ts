import { Injectable } from '@nestjs/common'
import { env } from '../../env'
import { Stripe } from 'stripe'

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

@Injectable()
export class ContractService {
  async createPayment(contract_id: number) {
    let amount = 11
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'hkd',
      payment_method_types: ['card'],
      return_url: `${env.ORIGIN}/contract/${contract_id}/confirm-payment`,
    })

    console.log('stripe payment intent id:', paymentIntent.id)

    return paymentIntent
  }

  async createCheckout(contract_id: number) {
    let amount = 11
    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'hkd',
            product_data: {
              name: 'Service Fee',
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${env.ORIGIN}/contract/${contract_id}/confirm-payment`,
      cancel_url: `${env.ORIGIN}/contract/${contract_id}/cancel-payment`,
    })

    console.log('stripe checkout session id:', checkoutSession.id)

    console.log('stripe checkout session:', checkoutSession)

    return { url: checkoutSession.url }
  }
}
