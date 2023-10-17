import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('job', table => {
    table.dropChecks('job_type_check')
    table.check(`"type" in ('demand','supply')`, undefined, 'job_type_check')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('job', table => {
    table.dropChecks('job_type_check')
    table.check(`"type" in ('demand','offer')`, undefined, 'job_type_check')
  })
}
