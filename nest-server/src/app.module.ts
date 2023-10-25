import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { KnexModule } from 'nest-knexjs'
import * as dotenv from 'dotenv'
import { env } from '../env'
import { JobModule } from './job/job.module'
import { ChatService } from './chat/chat.service'
import { ChatModule } from './chat/chat.module'
import { TagModule } from './tag/tag.module'
import { ContractModule } from './contract/contract.module'

dotenv.config()
@Module({
  imports: [
    UserModule,
    KnexModule.forRoot({
      config: {
        client: 'postgresql',
        connection: {
          database: env.DB_NAME,
          user: env.DB_USERNAME,
          password: env.DB_PASSWORD,
        },
      },
    }),
    JobModule,
    ChatModule,
    TagModule,
    ContractModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatService],
})
export class AppModule {}
