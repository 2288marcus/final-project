import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transaction', table => {
    table.timestamp('start_time').notNullable()
    table.timestamp('confirm_time').nullable()
    table.timestamp('cancel_time').nullable()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transaction', table => {
    table.dropColumn('cancel_time')
    table.dropColumn('confirm_time')
    table.dropColumn('start_time')
  })
}
