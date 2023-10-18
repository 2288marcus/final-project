import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

  if (!(await knex.schema.hasTable('user'))) {
    await knex.schema.createTable('user', table => {
      table.increments('id')
      table.string('username', 32).notNullable().unique()
      table.string('fullName', 32).notNullable()
      table.string('hkId', 8).notNullable().unique()
      table.string('email', 255).notNullable().unique()
      table.string('public_key', 44).notNullable().unique()
      table.string('hk_phone', 8).notNullable().unique()
      table.boolean('human_verification').nullable()
      table.string('cv_upload', 255).nullable()
      table.text('description').nullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('job'))) {
    await knex.schema.createTable('job', table => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('user.id')
      table.string('title', 255).notNullable()
      table.text('description').notNullable()
      table.integer('price').notNullable()
      table.enum('type', ['demand', 'supply']).notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('job_comment'))) {
    await knex.schema.createTable('job_comment', table => {
      table.increments('id')
      table.integer('job_id').unsigned().notNullable().references('job.id')
      table.integer('user_id').unsigned().notNullable().references('user.id')
      table.integer('score').notNullable()
      table.text('remark').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('tag'))) {
    await knex.schema.createTable('tag', table => {
      table.increments('id')
      table.text('name').notNullable().unique()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('job_tag'))) {
    await knex.schema.createTable('job_tag', table => {
      table.increments('id')
      table.integer('job_id').unsigned().notNullable().references('job.id')
      table.integer('tag_id').unsigned().notNullable().references('tag.id')
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('bookmark'))) {
    await knex.schema.createTable('bookmark', table => {
      table.increments('id')
      table.integer('demander_id').unsigned().notNullable().references('user.id')
      table.integer('supplier_id').unsigned().notNullable().references('user.id')
      table.integer('job_id').unsigned().notNullable().references('job.id')
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('contract'))) {
    await knex.schema.createTable('contract', table => {
      table.increments('id')
      table.integer('real_price').notNullable()
      table.text('real_description').notNullable()
      table.timestamp('estimated_finish_time').notNullable()
      table.timestamp('real_finish_time').nullable()
      table.timestamp('confirm_finish_time').nullable()
      table.timestamp('cancel_time').nullable()
      table.enum('status', ['confirm_contract', 'start_service', 'finish_service', 'confirm_finish']).notNullable()
      table.integer('job_id').unsigned().notNullable().references('job.id')
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('chatroom'))) {
    await knex.schema.createTable('chatroom', table => {
      table.increments('id')
      table.integer('job_id').unsigned().notNullable().references('job.id')
      table.integer('supplier_id').unsigned().notNullable().references('user.id')
      table.integer('demander_id').unsigned().notNullable().references('user.id')
      table.integer('contract_id').unsigned().notNullable().references('contract.id')
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('message'))) {
    await knex.schema.createTable('message', table => {
      table.increments('id')
      table.integer('chatroom_id').unsigned().notNullable().references('chatroom.id')
      table.text('content').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('transaction'))) {
    await knex.schema.createTable('transaction', table => {
      table.increments('id')
      table.integer('contract_id').unsigned().notNullable().references('contract.id')
      table.enum('direction', ['buyer_to_system', 'system_to_seller', 'system_to_buyer']).notNullable()
      table.timestamps(false, true)
    })
  }
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('transaction')
  await knex.schema.dropTableIfExists('message')
  await knex.schema.dropTableIfExists('chatroom')
  await knex.schema.dropTableIfExists('contract')
  await knex.schema.dropTableIfExists('bookmark')
  await knex.schema.dropTableIfExists('job_tag')
  await knex.schema.dropTableIfExists('tag')
  await knex.schema.dropTableIfExists('job_comment')
  await knex.schema.dropTableIfExists('job')
  await knex.schema.dropTableIfExists('user')
}
