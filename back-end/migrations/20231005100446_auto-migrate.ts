import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('job', table => {
    table.integer('price').notNullable().alter()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('job', table => {
    table.specificType('price', 'real').notNullable().alter()
  })
}
