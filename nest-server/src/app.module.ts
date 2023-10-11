import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { KnexModule } from 'nest-knexjs'
import * as dotenv from 'dotenv'
import { MulterModule } from '@nestjs/platform-express'
dotenv.config()
@Module({
  imports: [
    UserModule,
    KnexModule.forRoot({
      config: {
        client: 'postgresql',
        connection: {
          database: process.env.DB_NAME,
          user: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
