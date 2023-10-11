import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { print } from 'listening-on'
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.useStaticAssets('public')
  let port = 3000
  await app.listen(port)
  print(port)
}
bootstrap()
