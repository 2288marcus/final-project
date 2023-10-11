import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('contract', table => {
    table.dropColumn('details')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('contract', table => {
    table.text('details').notNullable()
  })
}
