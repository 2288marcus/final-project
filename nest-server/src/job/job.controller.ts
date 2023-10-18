import { Body, Controller, Get, Headers, Post } from '@nestjs/common'
import { JobService } from './job.service'
import { number, object, string } from 'cast.ts'
import { UserService } from '../user/user.service'

export enum jobtype {
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

  @Post('jobpost')
  async jobpost(@Body() body, @Headers('Authorization') authorization) {
    let user_id = await this.userService.authorize(authorization)
    let input = object({
      body: object({
        price: number(),
        title: string(),
        description: string(),
        type: string(),
      }),
    }).parse({ body })
    let result = await this.jobService.jobpost(input.body, user_id)
    return result
  }
}
