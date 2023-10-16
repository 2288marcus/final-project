import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { Knex, knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import { verifyObjectSignature } from 'src/utils/encode'

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

  async signUp(input: {
    username: string
    email: string
    hkId: string
    hk_phone: string
    fullName: string
    public_key: string
  }) {
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

  async login(input: { now: number; public_key: string; signature: string }) {
    if (Date.now() - input.now > 10 * 1000)
      throw new UnauthorizedException('Signature expired')

    let isValid = verifyObjectSignature({
      object: { now: input.now },
      publicKeyBase64: input.public_key,
      signatureBase64: input.signature,
    })

    if (!isValid) throw new UnauthorizedException('Invalid signature')

    let user = await this.knex('user')
      .select('id')
      .where('public_key', input.public_key)
      .first()

    if (!user)
      throw new UnauthorizedException('This public key is not registered')

    return { id: user.id }
  }
}
