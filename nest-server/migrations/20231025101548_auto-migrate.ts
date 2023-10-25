import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex('contract').delete()
  await knex.schema.alterTable('contract', table => {
    table.unique(['job_id'])
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('contract', table => {
    table.dropUnique(['job_id'])
  })
}
