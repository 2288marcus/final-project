import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { KnexModule } from 'nest-knexjs'
import * as dotenv from 'dotenv'
import { MulterModule } from '@nestjs/platform-express'
import { env } from './env'
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
