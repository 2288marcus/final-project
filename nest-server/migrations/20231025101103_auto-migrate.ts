import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('chatroom', table => {
    table.dropColumn('contract_id')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('chatroom', table => {
    table.integer('contract_id').unsigned().nullable().references('contract.id')
  })
}
