import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transaction', table => {
    table.dropColumn('transaction_time')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transaction', table => {
    table.timestamp('transaction_time').nullable()
  })
}
