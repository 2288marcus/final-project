import { config } from 'dotenv'
import populateEnv from 'populate-env'

config()

export const env = {
  DB_HOST: 'localhost',
  DB_PORT: 5432,
  DB_NAME: '',
  DB_USERNAME: '',
  DB_PASSWORD: '',
  STRIPE_SECRET_KEY: '',
  PORT: 3000,
  ORIGIN: 'http://localhost:3000',
}

populateEnv(env, { mode: 'halt' })
