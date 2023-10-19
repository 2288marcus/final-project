import { Controller, Get, Query } from '@nestjs/common'
import { TagService } from './tag.service'
import { object, string } from 'cast.ts'

@Controller('tags')
export class TagController {
  constructor(private readonly JobTagService: TagService) {}

  @Get()
  getTagList() {
    return this.JobTagService.getTagList({ searchText: '' })
  }

  @Get('/search')
  searchTagList(@Query() query) {
    let input = object({
      query: object({
        q: string({ nonEmpty: true }),
      }),
    }).parse({ query })
    return this.JobTagService.getTagList({ searchText: input.query.q })
  }
}
