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

  async getSelfProfile(id: number) {
    let profile = await this.knex
      .select(
        'id',
        'username',
        'public_key',
        'email',
        'hkId as HKID',
        'cv_upload',
        'hk_phone as HK_phone',
        'fullName',
        'human_verification',
        'created_at',
        'updated_at',
      )
      .from('user')
      .where({ id })
      .first()
    if (!profile) throw new NotFoundException('profile not found by id: ' + id)
    profile.cv_upload = null
    return { profile }
  }

  async getPublicProfile(id: number) {
    // TODO
    return await this.knex
      .select('id', 'username')
      .from('user')
      .where({ id })
      .first()
  }

  updateProfile(
    id: number,
    profile: { email: string; desc: string; nickname: string },
  ) {
    return {}
  }

  async signUp(input: any) {
    return await this.knex
      .insert({
        username: input.username,
        email: input.email,
        hkId: input.hkId,
        // card: input.card,
        hk_phone: input.hk_phone,
        fullName: input.fullName,
        public_key: input.public_key,
      })
      .into('user')
      .returning('id')
  }
}
