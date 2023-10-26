import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex('transaction').del()
  await knex('contract').del()
  await knex.schema.alterTable('contract', table => {
    table.integer('room_id').unsigned().notNullable().references('chatroom.id')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('contract', table => {
    table.dropColumn('room_id')
  })
}
