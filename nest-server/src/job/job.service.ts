import {
  BadRequestException,
  Injectable,
  NotFoundException,
  NotImplementedException,
  UnauthorizedException,
} from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import { groupBy } from 'rxjs'
import { TagService } from 'src/tag/tag.service'
@Injectable()
export class JobService {
  constructor(
    @InjectModel() private readonly knex: Knex,
    private readonly tagService: TagService,
  ) {}

  private async queryJobList(query: Knex.QueryBuilder) {
    let jobList = await query
      .whereNull('cancel_time')
      .select(
        'job.id as job_id',
        'job.user_id',
        'user.username',
        'job.title',
        'job.description',
        'job.price',
        'job.type',
        'job.created_at',
        'job.cancel_time',
        this.knex.raw('count(bookmark.user_id) as has_bookmark'),
      )
      .orderBy('job.id', 'desc')
    for (let job of jobList) {
      let rows = await this.knex('tag')
        .select('tag.name')
        .innerJoin('job_tag', 'job_tag.tag_id', 'tag.id')
        .where('job_tag.job_id', job.job_id)
      job.tags = rows.map(row => row.name)
    }
    return { jobList }
  }

  async searchJobList(
    user_id: number | null,
    filter: {
      user_id: number | null
      keyword: string | null
    },
  ) {
    let query = this.knex

      .from('job')
      .innerJoin('user', 'user.id', 'job.user_id')
      .leftJoin(
        'bookmark',
        this.knex.raw('bookmark.job_id = job.id and bookmark.user_id = ?', [
          user_id,
        ]),
      )
      .groupBy('job.id', 'user.id')
    if (filter.user_id) {
      query = query.where('user.id', filter.user_id)
    }
    if (filter.keyword) {
      query = query.whereILike('job.title', '%' + filter.keyword + '%')
    }
    return this.queryJobList(query)
  }

  //////////////////////////////////////
  async cancelJob(user_id: number, job_id: number) {
    let contract = await this.knex('contract')
      .select('id')
      .where({ job_id })
      .first()
    if (contract) {
      throw new BadRequestException(
        'the job has already established contract, cannot be cancelled',
      )
    }
    await this.knex('job')
      .update({ cancel_time: this.knex.fn.now() })
      .where({ id: job_id, user_id })
    return {}
  }
  //////////////////////////////////////

  async createJob(
    input: {
      title: string
      description: string
      price: number
      type: string
      tags: string[]
    },
    user_id: number,
  ) {
    return await this.knex.transaction(async knex => {
      let [{ id: job_id }] = await knex
        .insert({
          user_id,
          title: input.title,
          description: input.description,
          price: input.price,
          type: input.type,
        })
        .into('job')
        .returning('id')

      for (let name of input.tags) {
        let tag_id = await this.tagService.getTagId(knex, name)
        await knex('job_tag').insert({ job_id, tag_id })
      }

      return { job_id }
    })
  }

  async getBookmarkList(user_id: number) {
    let query = this.knex
      .from('bookmark')
      .innerJoin('job', 'job.id', 'bookmark.job_id')
      .innerJoin('user', 'user.id', 'bookmark.user_id')
      .where('bookmark.user_id', user_id)
      .groupBy('job.id', 'user.id')
      .orderByRaw(this.knex.raw('max(bookmark.id) desc'))
    return this.queryJobList(query)
  }

  async deleteBookmark(user_id: number, job_id: number) {
    await this.knex('bookmark')
      .where({
        user_id,
        job_id,
      })
      .del()
    return {}
  }

  async addBookmark(user_id: number, job_id: number) {
    await this.deleteBookmark(user_id, job_id)
    await this.knex('bookmark')
      .insert({
        user_id,
        job_id,
      })
      .into('bookmark')
      .returning('id')
    return {}
  }
}
