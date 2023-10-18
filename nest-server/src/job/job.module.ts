import { Module } from '@nestjs/common'
import { JobService } from './job.service'
import { JobController } from './job.controller'
import { UserService } from 'src/user/user.service'

@Module({
  providers: [JobService, UserService],
  controllers: [JobController],
})
export class JobModule {}
