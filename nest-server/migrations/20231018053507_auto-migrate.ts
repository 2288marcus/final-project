import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('message', table => {
    table.integer('user_id').unsigned().notNullable().references('user.id')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('message', table => {
    table.dropColumn('user_id')
  })
}
