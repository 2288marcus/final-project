import {
  BadRequestException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common'
import { env } from '../env'
import { Stripe } from 'stripe'
import { InjectModel } from 'nest-knexjs'
import { Knex } from 'knex'
import { later } from '@beenotung/tslib/async/wait'

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
      mode: 'payment',
      payment_intent_data: {
        description: 'Service Fee of ' + contract.title,
      },
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
      success_url: `${env.SERVER_ORIGIN}/contract/${contract_id}/confirm-payment`,
      cancel_url: `${env.SERVER_ORIGIN}/contract/${contract_id}/cancel-payment`,
    })

    console.log('stripe checkout session id:', checkoutSession.id)
    // console.log('stripe checkout session:', checkoutSession)

    // TODO insert into transaction
    await this.knex
      .insert({
        real_price: amount_in_cent,
        contract_id,
        direction: 'buyer_to_system',
        stripe_checkout_session_id: checkoutSession.id,
        start_time: new Date(),
      })
      .into('transaction')
      .where('id', contract_id)
      .returning('id')

    return { url: checkoutSession.url }
    // return { url: paymentIntent.url }
  }
  //////////////////////////////////////////
  async getChatroom(id: number) {
    let room_id = await this.knex
      .select('room_id')
      .from('contract')
      .where({ id })

    return { room_id }
  }
  //////////////////////////////////////////
  async confirmCheckout(contract_id: number, id: number) {
    // TODO check status from stripe(stripe:API)
    let transaction = await this.knex
      .select('transaction.stripe_checkout_session_id', 'transaction.id')
      .from('transaction')
      .where('transaction.contract_id', contract_id)

      .orderBy('id', 'desc')
      .first()

    if (!transaction) throw new NotFoundException('transaction not found')

    const session = await stripe.checkout.sessions.retrieve(
      transaction.stripe_checkout_session_id,
    )

    if (session.status == 'complete' && session.payment_status == 'paid') {
      await this.knex
        .update({
          confirm_time: this.knex.fn.now(),
        })
        .into('transaction')
        .where('transaction.id', transaction.id)
        .returning('id')

      return {}
    }

    // throw new BadRequestException('payment not completed')
    // async getTagList(query: { searchText: string }) {
    //   let tagList = await this.knex
    //     .select(
    //       'tag.id',
    //       'tag.name',
    //       this.knex.raw('COUNT(job_tag.job_id) as used'),
    //     )
    //     .from('tag')
    //     .innerJoin('job_tag', 'tag.id', 'job_tag.tag_id')
    //     .whereILike('tag.name', '%' + query.searchText + '%')
    //     .groupBy('tag.id')
    //     .orderByRaw('COUNT(job_tag.job_id) desc')
    //     .limit(10)

    //   return { tagList }
    // }
    //////////////////////

    //////////////////////
    // TODO update transaction
    ///////////////////////
    // await this.knex
    //   .update({
    //     confirm_time: new Date(),
    //   })
    //   .into('transaction')
    //   .where('id', contract_id)
    //   .returning('id')

    ///////////////////////

    // return { room_id: 2 }
    // return {}
  }
}
