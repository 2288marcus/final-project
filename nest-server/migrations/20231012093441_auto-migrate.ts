import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user', table => {
    table.dropColumn('HKID')
    table.string('hkId', 8).notNullable().unique()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user', table => {
    table.dropColumn('hkId')
    table.string('HKID', 8).notNullable().unique()
  })
}
