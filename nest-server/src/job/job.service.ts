import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'
import { TagService } from 'src/tag/tag.service'
@Injectable()
export class JobService {
  constructor(
    @InjectModel() private readonly knex: Knex,
    private readonly tagService: TagService,
  ) {}

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
}
