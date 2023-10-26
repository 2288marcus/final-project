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

  private async queryJobList(
    query: Knex.QueryBuilder,
    whereSQL: string = '',
    whereBindings: string[] = [],
  ) {
    whereSQL += ` and "job"."cancel_time" is null`
    query = query
      .whereRaw(whereSQL, whereBindings)
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
    // console.log('query:', query.toSQL().sql, query.toSQL().bindings)
    let jobList = await query
    for (let job of jobList) {
      let rows = await this.knex('tag')
        .select('tag.name')
        .innerJoin('job_tag', 'job_tag.tag_id', 'tag.id')
        .where('job_tag.job_id', job.job_id)
      job.tags = rows.map(row => row.name)
    }
    return { jobList }
  }
  ///////////////////////////////////
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

    let whereSQL = 'true'
    let whereBindings = []

    if (filter.user_id) {
      whereSQL += ` and "user"."id" = ?`
      whereBindings.push(filter.user_id)
    }

    let keywords = filter.keyword?.split(' ') || []

    for (let keyword of keywords) {
      whereSQL += ` and (
         "job"."description" ilike ?
      or "job"."title" ilike ?
      or "user"."username" ilike ?
      or "job"."id" in (
          select "job_tag"."job_id"
          from "job_tag"
          inner join "tag" on "tag"."id" = "job_tag"."tag_id"
          where "tag"."name" ilike ?
        )
      )`
      whereBindings.push(
        '%' + keyword + '%',
        '%' + keyword + '%',
        '%' + keyword + '%',
        '%' + keyword + '%',
      )
    }

    return this.queryJobList(query, whereSQL, whereBindings)
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
      // .where('bookmark.user_id', user_id)
      .groupBy('job.id', 'user.id')
      .orderByRaw(this.knex.raw('max(bookmark.id) desc'))

    let whereSQL = 'true'
    let whereBindings = []

    whereSQL += ` and "user"."id" = ?`
    whereBindings.push(user_id)

    return this.queryJobList(query, whereSQL, whereBindings)
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
