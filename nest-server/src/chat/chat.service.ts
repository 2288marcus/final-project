import { Injectable } from '@nestjs/common'
import { Knex, knex } from 'knex'
import { InjectModel } from 'nest-knexjs'

@Injectable()
export class ChatService {
  constructor(@InjectModel() private readonly knex: Knex) {}

  authorize(authorization: any) {
    throw new Error('Method not implemented.')
  }
  async postMessage(input: {
    chatroom_id: number
    content: string
    user_id: number
  }) {
    return await this.knex
      .insert({
        chatroom_id: input.chatroom_id,
        content: input.content,
        user_id: input.user_id,
      })
      .into('message')
      .returning('id')
  }

  async getMessage(chatroom_id: number) {
    let content = await this.knex
      .select(
        'message.id',
        'user.username',
        'message.content',
        'chatroom_id',
        'message.created_at as time',
      )
      .from('message')
      .join('user', 'user.id', 'message.user_id')
      .where({ chatroom_id })
      .orderBy('message.created_at', 'asc')
    return { content }
  }

  async getChatroom(user_id: number) {
    let chatroomList = await this.knex
      .select(
        'chatroom.id',
        'supplier.username as supplier_username',
        'demander.username as demander_username',
        'chatroom.created_at',
        'supplier_id',
        'demander_id',
        'job.title',
        'job.type',
      )
      .from('chatroom')
      .join('user as supplier', 'supplier.id', 'chatroom.supplier_id')
      .join('user as demander', 'demander.id', 'chatroom.demander_id')
      .join('job', 'job.id', 'chatroom.job_id')
      .where('supplier_id', user_id)
      .orWhere('demander_id', user_id)
      .orderBy('chatroom.created_at', 'asc')

    return { chatroomList }
  }

  async postContract(input: {
    contract_id: number
    description: string
    user_id: number
  }) {
    return await this.knex
      .insert({
        chatroom_id: input.contract_id,
        real_description: input.description,
        user_id: input.user_id,
      })
      .into('contract')
      .returning('id')
  }
}
