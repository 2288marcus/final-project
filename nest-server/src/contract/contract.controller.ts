import {
  Body,
  Controller,
  Post,
  Get,
  Headers,
  Query,
  Param,
} from '@nestjs/common'
import { ContractService } from './contract.service'

@Controller('contract')
export class ContractController {
  constructor(private readonly ContractService: ContractService) {}

  @Post(':contract_id/create-payment')
  async createPaymentIntent(@Param('contract_id') contract_id) {
    const paymentIntent = await this.ContractService.createCheckout(contract_id)
    return paymentIntent
  }

  @Get(':contract_id/confirm-payment')
  async confirmPaymentIntent(@Param('contract_id') contract_id) {
    // console.log('confirmPaymentIntent ?????')
    // return 'TODO'
    // const paymentIntent = await this.ContractService.createCheckout(contract_id)
    // return paymentIntent
  }
}
