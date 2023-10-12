import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user', table => {
    table.dropColumn('HK_phone')
    table.string('hk_phone', 8).notNullable().unique()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user', table => {
    table.dropColumn('hk_phone')
    table.string('HK_phone', 8).notNullable().unique()
  })
}
