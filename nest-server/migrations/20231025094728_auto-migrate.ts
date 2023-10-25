import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transaction', table => {
    table.renameColumn('checkout_ID', 'stripe_checkout_session_id')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transaction', table => {
    table.renameColumn('stripe_checkout_session_id', 'checkout_ID')
  })
}
