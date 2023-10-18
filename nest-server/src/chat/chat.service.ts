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
    contract_id: number
    // updated_at: number
    content: string
    user_id: number
  }) {
    return await this.knex
      .insert({
        contract_id: input.contract_id,
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
        this.knex.raw('message.created_at as time'),
      )
      .from('message')
      .join('user', 'user.id', 'message.user_id')
      .where({ chatroom_id })

    return { content }
  }
  // async getMessage(chatroom_id: number) {
  //   let content = await this.knex
  //     .select(
  //       'message.id',
  //       // 'user_id',
  //       'username',
  //       'content',
  //       'message.created_at as time',
  //     )
  //     .from('message')
  //     .join('user', 'user.id', 'user.username')
  //     .where({ chatroom_id })

  //   console.log({ content })
  //   // if (!profile) throw new NotFoundException('profile not found by id: ' + id)
  //   // profile.cv_upload = null
  //   return { content }
  // }
}
