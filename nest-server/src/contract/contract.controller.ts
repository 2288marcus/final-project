import {
  Controller,
  Post,
  Get,
  Param,
  HttpException,
  NotImplementedException,
  Body,
  Headers,
  Query,
} from '@nestjs/common'
import { ContractService } from './contract.service'
import { env } from '../env'

@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post(':contract_id/create-payment')
  async createPaymentIntent(@Param('contract_id') contract_id) {
    const paymentIntent = await this.contractService.createCheckout(contract_id)
    return paymentIntent
  }
  @Get(':room_id/chatroom')
  async getChatroom(@Param('room_id') room_id) {
    return await this.contractService.getChatroom(room_id)
  }

  @Get(':contract_id/confirm-payment')
  async confirmPaymentIntent(@Param('contract_id') contract_id) {
    console.log('confirm stripe payment', { contract_id })
    // return 'TODO'
    // const paymentIntent =
    //   await this.contractService.confirmPaymentIntent(contract_id)
    // return paymentIntent

    // let json = await this.contractService.confirmCheckout(contract_id)

    // // throw new NotImplementedException('TODO')

    // return `<!DOCTYPE html><html>
    // <head>
    //   <meta http-equiv="Refresh" content="0; url='${env.APP_ORIGIN}/Chatroom/${room_id}" />
    // </head>
    // <body>
    //   <p>
    //     Redirecting to ${env.APP_ORIGIN}/Chatroom/${room_id} ...
    //   </p>
    // </body>
    // </html>`
  }
}
