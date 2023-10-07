import Knex from 'knex'
import { print } from 'listening-on'

const knexConfigs = require('./knexfile')
const configMode = process.env.NODE_ENV || 'development'
const knexConfig = knexConfigs[configMode]
const knex = Knex(knexConfig)
//
import express, { Express } from 'express'
import http, { Server as HTTPServer } from 'http'
import { User, userRoute } from './routes/userRoute'
import expressSession from 'express-session'
import path from 'path'
// import { client } from './utils/pg'
import cors from 'cors'
import { Server as SocketIOServer, Socket } from 'socket.io'

const app: Express = express()
app.use(cors())
app.use(express.static('pubic'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 設定 session，用於儲存用戶登入狀態
app.use(
  expressSession({
    secret: 'Tecky Academy teaches typescript',
    resave: true,
    saveUninitialized: true,
  }),
)

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

// 設定 404 頁面
app.use((req, res) => {
  res.sendFile(path.resolve('public', '404.html'))
})

let port = 8100
server.listen(port, () => {
  //   console.log('Server running at port 5173')
  print(port)
})
