import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('job', table => {
    table.enum('type', ['demand', 'supply']).notNullable().alter()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('job', table => {
    table.enum('type', ['demand', 'offer']).notNullable().alter()
  })
}
