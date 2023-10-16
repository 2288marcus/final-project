import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'

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
}
