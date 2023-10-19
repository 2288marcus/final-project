import { Body, Controller, Get, Headers, Post, Delete } from '@nestjs/common'
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
  async bookmark(@Body() body, @Headers('Authorization') authorization) {
    let user_id = await this.userService.authorize(authorization)
    let input = object({
      body: object({
        price: number(),
        title: string(),
        description: string(),
        type: string(),
      }),
    }).parse({ body })
    let result = await this.jobService.bookmark(input.body, user_id)
    return result
  }

  @Delete('bookmark')
  async unbookmark(@Body() body, @Headers('Authorization') authorization) {
    let user_id = await this.userService.authorize(authorization)
    let input = object({
      body: object({
        price: number(),
        title: string(),
        description: string(),
        type: string(),
      }),
    }).parse({ body })
    let result = await this.jobService.unbookmark(input.body, user_id)
    return result
  }
}
