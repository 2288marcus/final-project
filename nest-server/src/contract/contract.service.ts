import { Injectable, NotFoundException } from '@nestjs/common'
import { env } from '../env'
import { Stripe } from 'stripe'
import { InjectModel } from 'nest-knexjs'
import { Knex } from 'knex'

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

@Injectable()
export class ContractService {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async createCheckout(contract_id: number) {
    let contract = await this.knex('contract')
      .select('contract.real_price', 'job.title')
      .innerJoin('job', 'job.id', 'contract.job_id')
      .where({ 'contract.id': contract_id })
      .first()
    if (!contract) throw new NotFoundException('contract not found')
    let amount_in_cent = contract.real_price * 100
    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'hkd',
            product_data: {
              name: contract.title,
            },
            unit_amount: amount_in_cent,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${env.APP_ORIGIN}/contract/${contract_id}/confirm-payment`,
      cancel_url: `${env.APP_ORIGIN}/contract/${contract_id}/cancel-payment`,
    })

    console.log('stripe checkout session id:', checkoutSession.id)

    console.log('stripe checkout session:', checkoutSession)

    // TODO insert into transaction

    return { url: checkoutSession.url }
  }

  async confirmCheckout(contract_id: number) {
    // TODO check status from stripe
    //////////////////////

    //////////////////////
    // TODO update transaction
    ///////////////////////
    await this.knex
      .update({
        transaction_time: new Date(),
      })
      .into('contract')
      .where('id', contract_id)
      .returning('id')
    ///////////////////////
    return { room_id: 2 }
  }
}
