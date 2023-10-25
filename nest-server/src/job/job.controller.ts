import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Delete,
  Param,
  Query,
} from '@nestjs/common'
import { JobService } from './job.service'
import {
  array,
  int,
  number,
  object,
  string,
  values,
  id,
  optional,
} from 'cast.ts'
import { UserService } from '../user/user.service'

@Controller('jobs')
export class JobController {
  constructor(
    private readonly jobService: JobService,
    private userService: UserService,
  ) {}

  @Get('search')
  async searchJobList(@Query() query, @Headers('Authorization') authorization) {
    let user_id = await this.userService
      .authorize(authorization)
      .catch(() => null)
    let input = object({
      query: object({
        user_id: optional(id()),
        keyword: optional(string()),
      }),
    }).parse({ query })
    return this.jobService.searchJobList(user_id, {
      user_id: input.query.user_id,
      keyword: input.query.keyword,
    })
  }

  // @Post()
  // async createJob(@Body() body, @Headers('Authorization') authorization) {
  //   let user_id = await this.userService.authorize(authorization)
  //   // let user_id = 1
  //   let input = object({
  //     body: object({
  //       price: int({ min: 1 }),
  //       title: string({ nonEmpty: true }),
  //       description: string({ nonEmpty: true }),
  //       type: values(['demand' as const, 'supply' as const]),
  //       tags: array(string({ nonEmpty: true })),
  //     }),
  //   }).parse({ body })
  //   let result = await this.jobService.createJob(input.body, user_id)
  //   return result
  // }
  /////////////////////////////

  @Post()
  async createJob(@Body() body, @Headers('Authorization') authorization) {
    let user_id = await this.userService.authorize(authorization)
    // let user_id = 1
    let input = object({
      body: object({
        price: int({ min: 1 }),
        title: string({ nonEmpty: true }),
        description: string({ nonEmpty: true }),
        type: values(['demand' as const, 'supply' as const]),
        tags: array(string({ nonEmpty: true })),
      }),
    }).parse({ body })
    let result = await this.jobService.createJob(input.body, user_id)
    return result
  }
  /////////////////////////////
  @Get('bookmark')
  async getBookmarkList(@Headers('Authorization') authorization) {
    let user_id = await this.userService.authorize(authorization)
    return await this.jobService.getBookmarkList(user_id)
  }

  @Delete(':job_id/bookmark')
  async deleteBookmark(
    @Headers('Authorization') authorization,
    @Param('job_id') job_id: string,
  ) {
    let user_id = await this.userService.authorize(authorization)
    return await this.jobService.deleteBookmark(user_id, parseInt(job_id))
  }

  @Post(':job_id/bookmark')
  async addBookmark(
    @Headers('Authorization') authorization,
    @Param('job_id') job_id: string,
  ) {
    let user_id = await this.userService.authorize(authorization)
    return await this.jobService.addBookmark(user_id, parseInt(job_id))
  }

  @Post(':job_id/cancel')
  async cancelJob(
    @Headers('Authorization') authorization,
    @Param('job_id') job_id: string,
  ) {
    let user_id = await this.userService.authorize(authorization)
    return await this.jobService.cancelJob(user_id, parseInt(job_id))
  }
}
