import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('contract', table => {
    table.dropColumn('status')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('contract', table => {
    table.enum('status', ['confirm_contract', 'start_service', 'finish_service', 'confirm_finish']).notNullable()
  })
}
