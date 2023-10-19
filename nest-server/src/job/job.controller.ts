import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Delete,
  Param,
} from '@nestjs/common'
import { JobService } from './job.service'
import { number, object, string } from 'cast.ts'
import { UserService } from '../user/user.service'

export enum jobType {
  demand = 'demand',
  supply = 'supply',
}
@Controller('jobs')
export class JobController {
  constructor(
    private readonly jobService: JobService,
    private userService: UserService,
  ) {}

  @Get()
  getJobList() {
    return this.jobService.getJobList()
  }

  @Post('jobPost')
  async jobPost(@Body() body, @Headers('Authorization') authorization) {
    let user_id = await this.userService.authorize(authorization)
    let input = object({
      body: object({
        price: number(),
        title: string(),
        description: string(),
        type: string(),
      }),
    }).parse({ body })
    let result = await this.jobService.jobPost(input.body, user_id)
    return result
  }

  @Get('bookmark')
  async bookmark(@Headers('Authorization') authorization) {
    let user_id = await this.userService.authorize(authorization)
    return await this.jobService.getBookmarkList(user_id)
  }

  @Delete('bookmark/:bookmark_id')
  async deleteBookmark(
    @Headers('Authorization') authorization,
    @Param('bookmark_id') bookmark_id: string,
  ) {
    let user_id = await this.userService.authorize(authorization)
    // let user_id = 2

    return await this.jobService.deleteBookmark(user_id, parseInt(bookmark_id))
  }
}
