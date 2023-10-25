import { Module } from '@nestjs/common'
import { ContractService } from './contract.service'
import { ContractController } from './contract.controller'
import { ConfigModule } from '@nestjs/config'

@Module({
  providers: [ContractService],
  controllers: [ContractController],
  imports: [ConfigModule.forRoot()],
})
export class ContractModule {}
