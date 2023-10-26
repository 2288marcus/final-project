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
      .select(
        'chatroom.job_id',
        'chatroom.supplier_id',
        'chatroom.demander_id',
        'chatroom.created_at',
        'contract.confirm_finish_time',
        'contract.real_finish_time',
        'job.title',
        'job.type',
        'job.price',
        'job.description',
      )
      .innerJoin('job', 'job.id', 'chatroom.job_id')
      .join('contract', 'contract.job_id', 'chatroom.job_id')
      .where('chatroom.id', input.chatroom_id)
      .first()

    // console.log({ room }, { input })

    if (!room) throw new NotFoundException('room not found')

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

    let contract = await this.knex
      .select(
        'contract.id as contract_id',
        'contract.real_description',
        'contract.created_at',
        'contract.real_price',
      )
      .from('contract')
      .where('contract.job_id', room.job_id)
      .first()

    return {
      room,
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
      .orderBy('chatroom.created_at', 'desc')

    return { chatroomList }
  }

  async postContract(input: {
    chatroom_id: number
    real_description: string
    real_price: number
    estimated_finish_time: Date
    user_id: number
  }) {
    let chatroom = await this.knex('chatroom')
      .select('job_id')
      .where({ id: input.chatroom_id })
      .andWhereRaw('(supplier_id = ? or demander_id = ?)', [
        input.user_id,
        input.user_id,
      ])
      .first()
    if (!chatroom) throw new NotFoundException('chatroom not found')

    let [{ id }] = await this.knex
      .insert({
        job_id: chatroom.job_id,
        real_description: input.real_description,
        real_price: input.real_price,
        estimated_finish_time: input.estimated_finish_time,
      })
      .into('contract')
      .returning('id')

    return { contract_id: id }
  }

  async startChatroom(input: { job_id: number; user_id: number }) {
    let job = await this.knex('job')
      .select('user_id', 'type')
      .where({ id: input.job_id })
      .first()

    let supplier_id
    let demander_id

    if (job.type == 'supply') {
      supplier_id = job.user_id
      demander_id = input.user_id
    } else if (job.type == 'demand') {
      demander_id = job.user_id
      supplier_id = input.user_id
    }
    let chatroom = await this.knex
      .from('chatroom')
      .select('id')
      .where({ job_id: input.job_id, supplier_id, demander_id })
      .first()
    if (chatroom) {
      return { chatroom_id: chatroom.id }
    }

    let [{ id }] = await this.knex
      .insert({
        job_id: input.job_id,
        supplier_id,
        demander_id,
      })
      .into('chatroom')
      .returning('id')
    return { chatroom_id: id }
  }

  async createRealFinishTime(contract_id: number) {
    return await this.knex
      .update({
        real_finish_time: new Date(),
      })
      .into('contract')
      .where('id', contract_id)
      .returning('id')
  }

  async createConfirmFinishTime(contract_id: number) {
    return await this.knex
      .update({
        confirm_finish_time: new Date(),
      })
      .into('contract')
      .where('id', contract_id)
      .returning('id')
  }
}
