import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user', table => {
    table.setNullable('public_key')
    table.setNullable('human_verification')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user', table => {
    table.dropNullable('human_verification')
    table.dropNullable('public_key')
  })
}
