import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('chatroom', table => {
    table.setNullable('contract_id')
  })
  await knex.schema.alterTable('transaction', table => {
    table.integer('real_price').notNullable()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transaction', table => {
    table.dropColumn('real_price')
  })
  await knex.schema.alterTable('chatroom', table => {
    table.dropNullable('contract_id')
  })
}
