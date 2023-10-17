import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('chat_message', table => {
    table.string('content').notNullable().alter()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('chat_message', table => {
    table.integer('content').notNullable().alter()
  })
}
