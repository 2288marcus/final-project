import Knex from 'knex'

const knexConfigs = require('./knexfile')
const configMode = process.env.NODE_ENV || 'development'
const knexConfig = knexConfigs[configMode]
const knex = Knex(knexConfig)

// Use Knex here
