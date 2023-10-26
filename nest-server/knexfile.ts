import type { Knex } from 'knex'
import * as dotenv from 'dotenv'
import { env } from './src/env'

// Update with your config settings.
dotenv.config()
const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'postgresql',
    connection: {
      database: env.DB_NAME,
      user: env.DB_USERNAME,
      password: env.DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
    // debug: true,
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: env.DB_NAME,
      user: env.DB_USERNAME,
      password: env.DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      database: env.DB_NAME,
      user: env.DB_USERNAME,
      password: env.DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
}

module.exports = config
