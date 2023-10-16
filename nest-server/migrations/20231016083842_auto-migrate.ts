import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user', table => {
    table.string('public_key', 44).notNullable().alter()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user', table => {
    table.specificType('public_key', 'char(44)').notNullable().alter()
  })
}
