import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user', table => {
    table.specificType('public_key', 'char(64)').notNullable().alter()
  })
  await knex.schema.alterTable('contract', table => {
    table.dropColumn('job_status')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('contract', table => {
    table.integer('job_status').notNullable()
  })
  await knex.schema.alterTable('user', table => {
    table.string('public_key', 255).notNullable().alter()
  })
}
