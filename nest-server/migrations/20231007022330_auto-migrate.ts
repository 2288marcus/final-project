import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user', table => {
    table.dropColumn('description')
    table.dropColumn('password_hash')
    table.string('fullName', 32).notNullable()
    table.string('HKID', 8).notNullable().unique()
    table.string('public_key', 255).notNullable().unique()
    table.string('HK_phone', 8).notNullable().unique()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user', table => {
    table.dropColumn('HK_phone')
    table.dropColumn('public_key')
    table.dropColumn('HKID')
    table.dropColumn('fullName')
    table.string('password_hash', 255).notNullable()
    table.text('description').notNullable()
  })
}
