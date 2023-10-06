import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

  if (!(await knex.schema.hasTable('user'))) {
    await knex.schema.createTable('user', table => {
      table.increments('id')
      table.string('username', 32).notNullable().unique()
      table.string('email', 255).notNullable().unique()
      table.string('password_hash', 255).notNullable()
      table.text('description').notNullable()
      table.boolean('human_verification').notNullable()
      table.string('cv_upload', 255).notNullable()
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
      table.enum('type', ['demand', 'offer']).notNullable()
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
      table.integer('buyer_user_id').unsigned().notNullable().references('user.id')
      table.integer('seller_user_id').unsigned().notNullable().references('user.id')
      table.integer('job_id').unsigned().notNullable().references('job.id')
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('transaction'))) {
    await knex.schema.createTable('transaction', table => {
      table.increments('id')
      table.integer('amount').notNullable()
      table.integer('user_id').unsigned().notNullable().references('user.id')
      table.enum('direction', ['from_system', 'to_system']).notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('contract'))) {
    await knex.schema.createTable('contract', table => {
      table.increments('id')
      table.integer('buyer_user_id').unsigned().notNullable().references('user.id')
      table.integer('seller_user_id').unsigned().notNullable().references('user.id')
      table.integer('job_status').notNullable()
      table.text('details').notNullable()
      table.timestamp('start_time').notNullable()
      table.timestamp('estimated_finish_time').notNullable()
      table.timestamp('claim_finish_time').nullable()
      table.timestamp('confirm_finish_time').nullable()
      table.timestamp('reject_finish_time').nullable()
      table.timestamp('cancel_time').nullable()
      table.integer('cancel_by_user_id').unsigned().nullable().references('user.id')
      table.timestamp('estimated_payment_release_time').notNullable()
      table.integer('system_receive_payment_id').unsigned().nullable().references('transaction.id')
      table.integer('system_send_payment_id').unsigned().nullable().references('transaction.id')
      table.integer('job_id').unsigned().notNullable().references('job.id')
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('chat_message'))) {
    await knex.schema.createTable('chat_message', table => {
      table.increments('id')
      table.integer('contract_id').unsigned().notNullable().references('contract.id')
      table.integer('user_id').unsigned().notNullable().references('user.id')
      table.integer('content').notNullable()
      table.timestamps(false, true)
    })
  }
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('chat_message')
  await knex.schema.dropTableIfExists('contract')
  await knex.schema.dropTableIfExists('transaction')
  await knex.schema.dropTableIfExists('bookmark')
  await knex.schema.dropTableIfExists('job_tag')
  await knex.schema.dropTableIfExists('tag')
  await knex.schema.dropTableIfExists('job_comment')
  await knex.schema.dropTableIfExists('job')
  await knex.schema.dropTableIfExists('user')
}
