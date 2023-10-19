import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import { type } from 'os'

export enum jobtype {
  demand = 'demand',
  supply = 'supply',
}
@Injectable()
export class JobService {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async getJobList() {
    let jobList = await this.knex
      .select(
        'job.id as job_id',
        'job.user_id',
        'user.username',
        'job.title',
        'job.description',
        'job.price',
        'job.type',
        'job.created_at',
      )
      .from('job')
      .innerJoin('user', 'user.id', 'job.user_id')
    for (let job of jobList) {
      let rows = await this.knex('tag')
        .select('tag.name')
        .innerJoin('job_tag', 'job_tag.tag_id', 'tag.id')
        .where('job_tag.job_id', job.job_id)
      job.tags = rows.map(row => row.name)
    }
    return { jobList }
  }

  async jobpost(
    input: {
      title: string
      description: string
      price: number
      type: string
      // type: enum(jobtype)
    },
    user_id: number,
  ) {
    return await this.knex
      .insert({
        user_id,
        title: input.title,
        description: input.description,
        price: input.price,
        type: input.type,
      })
      .into('job')
      .returning('id')
  }

  async bookmark(
    input: {
      title: string
      description: string
      price: number
      type: string
      // type: enum(jobtype)
    },
    user_id: number,
  ) {
    return await this.knex
      .insert({
        user_id,
        title: input.title,
        description: input.description,
        price: input.price,
        type: input.type,
      })
      .into('job')
      .returning('id')
  }

  async getBookmarkList(user_id: number) {
    let bookmarkList = await this.knex
      .from('bookmark')
      .innerJoin('job', 'job.id', 'bookmark.job_id')
      .select(
        'bookmark.job_id',
        'job.title',
        'job.description',
        'job.price',
        'job.type',
      )
      .where('bookmark.user_id', user_id)
    return { bookmarkList }
  }

  async unbookmark(
    input: {
      title: string
      description: string
      price: number
      type: string
      // type: enum(jobtype)
    },
    user_id: number,
  ) {
    return await this.knex
      .insert({
        user_id,
        title: input.title,
        description: input.description,
        price: input.price,
        type: input.type,
      })
      .into('job')
      .returning('id')
  }
}
