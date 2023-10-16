import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user', table => {
    table.dropColumn('card')
    table.specificType('public_key', 'char(44)').notNullable().alter()
    table.dropNullable('public_key')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user', table => {
    table.setNullable('public_key')
    table.specificType('public_key', 'char(64)').nullable().alter()
    table.string('card', 16).nullable().unique()
  })
}
