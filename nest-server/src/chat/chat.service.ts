import { Injectable } from '@nestjs/common'
import { number, object, string } from 'cast.ts'
import { Knex, knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import { verifyObjectSignature } from 'src/utils/encode'

@Injectable()
export class ChatService {
  constructor(@InjectModel() private readonly knex: Knex) {}

  authorize(authorization: any) {
    throw new Error('Method not implemented.')
  }
  async sendMessage(input: {
    chatroom_id: number
    // updated_at: number
    content: string
    user_id: number
  }) {
    return await this.knex
      .insert({
        chatroom_id: input.chatroom_id,
        // updated_at: input.updated_at,
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
        'user.username',
        'chatroom.created_at',
        'supplier_id',
        'demander_id',
      )
      .from('chatroom')
      .join('user', 'user.id', 'chatroom.user_id')
      .where('supplier_id', user_id)
      .orWhere('demander_id', user_id)
      .orderBy('chatroom.created_at', 'asc')
    // for (let chatroom of chatrooms) {
    //   let rows = await this.knex('tag')

    // }
    return { chatroomList }
  }
}
