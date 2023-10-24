import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Knex } from 'knex'
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

  async getRoomData(input: { user_id: number; chatroom_id: number }) {
    let room = await this.knex('chatroom')
      .select('job_id', 'supplier_id', 'demander_id', 'contract_id')
      .where('id', input.chatroom_id)
      .first()

    // console.log({ room }, { input })

    if (!room) throw new NotFoundException('romm not found')

    if (input.user_id != room.supplier_id && input.user_id != room.demander_id)
      throw new ForbiddenException('user not in room')

    let messages = await this.knex
      .select(
        'message.id',
        'user.username',
        'message.content',
        'message.created_at as time',
      )
      .from('message')
      .innerJoin('user', 'user.id', 'message.user_id')
      .where({ chatroom_id: input.chatroom_id })
      .orderBy('message.created_at', 'asc')

    let contract = !room.contract_id
      ? null
      : await this.knex
          .select(
            'contract.id as contract_id',
            'contract.real_description',
            'contract.created_at',
            'user.username',
          )
          .from('contract')
          .join('user', 'user.id', 'contract.job_id')
          .where('contract.id', room.contract_id)
          .first()

    return {
      messages,
      contract,
      supplier: await this.selectRoomMember(room.supplier_id),
      demander: await this.selectRoomMember(room.demander_id),
    }
  }

  private async selectRoomMember(user_id: number) {
    let user = await this.knex('user')
      .select('id', 'username')
      .where('id', user_id)
      .first()
    if (!user) throw new NotFoundException('room member not found')
    return user
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
