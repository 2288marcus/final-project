import Knex from 'knex'
import { print } from 'listening-on'

const knexConfigs = require('./knexfile')
const configMode = process.env.NODE_ENV || 'development'
const knexConfig = knexConfigs[configMode]
const knex = Knex(knexConfig)
//
import express, { Express } from 'express'
import http, { Server as HTTPServer } from 'http'
import cors from 'cors'
import { Server as SocketIOServer, Socket } from 'socket.io'

const app: Express = express()
app.use(cors())

const server: HTTPServer = http.createServer(app)

const io: SocketIOServer = new SocketIOServer(server, {
  cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] },
})

io.on('connection', (socket: Socket) => {
  console.log(`User connected: ${socket.id}`)

  socket.on('send-message', (message: any) => {
    io.emit('received-message', message)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

let port = 8100
server.listen(port, () => {
  //   console.log('Server running at port 5173')
  print(port)
})
