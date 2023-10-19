import { Injectable } from '@nestjs/common'
import { Knex } from 'knex'
import { InjectModel } from 'nest-knexjs'

@Injectable()
export class TagService {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async getTagList(query: { searchText: string }) {
    let tagList = await this.knex
      .select(
        'tag.id',
        'tag.name',
        this.knex.raw('COUNT(job_tag.job_id) as used'),
      )
      .from('tag')
      .innerJoin('job_tag', 'tag.id', 'job_tag.tag_id')
      .whereILike('tag.name', '%' + query.searchText + '%')
      .groupBy('tag.id')
      .orderByRaw('COUNT(job_tag.job_id) desc')
      .limit(10)

    return { tagList }
  }

  async getTagId(knex: Knex, name: string) {
    let tag = await knex('tag').select('id').where({ name }).first()
    if (tag) {
      return tag.id
    }
    let [{ id }] = await knex('tag').insert({ name }).returning('id')
    return id
  }
}
