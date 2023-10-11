import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('contract').del()

  // Inserts seed entries
  await knex('contract').insert([
    {
      id: 1,
      buyer_user_id: 1,
      seller_user_id: 2,
      start_time: new Date(),
      estimated_finish_time: new Date(),
      claim_finish_time: null,
      confirm_finish_time: null,
      reject_finish_time: null,
      cancel_time: null,
      cancel_by_user_id: null,
      estimated_payment_release_time: new Date(), // Provide a valid value here
      system_receive_payment_id: null,
      system_send_payment_id: null,
      job_id: 1,
    },
    {
      id: 2,
      buyer_user_id: 1,
      seller_user_id: 2,
      start_time: new Date(),
      estimated_finish_time: new Date(),
      claim_finish_time: null,
      confirm_finish_time: null,
      reject_finish_time: null,
      cancel_time: null,
      cancel_by_user_id: null,
      estimated_payment_release_time: new Date(), // Provide a valid value here
      system_receive_payment_id: null,
      system_send_payment_id: null,
      job_id: 2,
    },
    // Add more sample data entries as needed
  ])
}
