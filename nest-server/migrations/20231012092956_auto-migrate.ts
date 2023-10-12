import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user', table => {
    table.string('card', 16).nullable().unique()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user', table => {
    table.dropColumn('card')
  })
}
