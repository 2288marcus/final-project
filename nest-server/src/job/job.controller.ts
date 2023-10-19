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
import { array, int, number, object, string, values } from 'cast.ts'
import { UserService } from '../user/user.service'

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
