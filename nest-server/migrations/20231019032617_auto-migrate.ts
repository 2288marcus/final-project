import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('bookmark', table => {
    table.dropColumn('supplier_id')
    table.dropColumn('demander_id')
    table.integer('user_id').unsigned().notNullable().references('user.id')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('bookmark', table => {
    table.dropColumn('user_id')
    table.integer('demander_id').unsigned().notNullable().references('user.id')
    table.integer('supplier_id').unsigned().notNullable().references('user.id')
  })
}
