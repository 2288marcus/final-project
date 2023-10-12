import { Injectable, NotFoundException } from '@nestjs/common'
import { Knex, knex } from 'knex'
import { InjectModel } from 'nest-knexjs'

@Injectable()
export class UserService {
  constructor(@InjectModel() private readonly knex: Knex) {}
  async getUserIdByPublicKey(public_key: string) {
    let user = await knex('user').where({ public_key }).select('id').first()
    if (!user) throw new NotFoundException('User not found by public key')
    return user.id
  }

  async getProfile(id: number) {
    return await this.knex.select('*').from('user').where({ id }).first()
  }
  updateProfile(
    id: number,
    profile: { email: string; desc: string; nickname: string },
  ) {
    return {}
  }

  async signup(input: any) {
    return await this.knex
      .insert({
        username: input.username,
        email: input.email,
        HKID: input.HKID,
        HK_phone: input.HK_phone,
        fullName: input.fullName,
      })
      .into('user')
      .returning('id')
  }
}
