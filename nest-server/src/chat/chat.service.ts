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
  async content(input: {
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
      .into('chat_message')
      .returning('id')
  }

  async getMessage(contract_id: number) {
    let content = await this.knex
      .select(
        'chat_message.id',
        // 'user_id',
        'username',
        'content as message',
        'chat_message.created_at as time',
      )
      .from('chat_message')
      .join('user', 'user.id', 'chat_message.user_id')
      .where({ contract_id })

    console.log({ content })
    // if (!profile) throw new NotFoundException('profile not found by id: ' + id)
    // profile.cv_upload = null
    return { content }
  }
}
