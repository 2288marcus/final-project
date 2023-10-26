import {
  Body,
  Controller,
  Post,
  Get,
  Headers,
  Query,
  Param,
} from '@nestjs/common'
import { ChatService } from './chat.service'
import { UserService } from '../user/user.service'
import { date, id, int, object, string } from 'cast.ts'

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
  ) {}

  @Post(':chatroom_id/messages')
  async sendContent(
    @Body() body,
    @Param() params,
    @Headers('Authorization') authorization,
  ) {
    let user_id = await this.userService.authorize(authorization)
    let input = object({
      body: object({
        // updated_at: int(),
        content: string(),
      }),
      params: object({
        chatroom_id: id(),
      }),
    }).parse({ body, params })
    const result = await this.chatService.postMessage({
      chatroom_id: input.params.chatroom_id,
      content: input.body.content,
      user_id,
    })
    return result[0]
  }

  @Get('room/:chatroom_id')
  async getRoomData(
    @Headers('Authorization') authorization,
    @Param('chatroom_id') chatroom_id,
  ) {
    console.log({ authorization })

    let user_id = await this.userService.authorize(authorization)
    // 获取消息
    return await this.chatService.getRoomData({ user_id, chatroom_id })
  }

  @Get('chatroom')
  async getChatroom(@Headers('Authorization') authorization) {
    let user_id = await this.userService.authorize(authorization)
    // 获取消息
    return await this.chatService.getChatroom(user_id)
  }

  @Post(':chatroom_id/contract')
  async postContract(
    @Body() body,
    @Param() params,
    @Headers('Authorization') authorization,
  ) {
    let user_id = await this.userService.authorize(authorization)
    let input = object({
      body: object({
        // updated_at: int(),
        real_description: string(),
        real_price: int(),
        estimated_finish_time: date(),
      }),
      params: object({
        chatroom_id: id(),
      }),
    }).parse({ body, params })
    return await this.chatService.postContract({
      chatroom_id: input.params.chatroom_id,
      real_description: input.body.real_description,
      real_price: input.body.real_price,
      estimated_finish_time: input.body.estimated_finish_time,
      user_id,
    })
  }

  @Post(':job_id/start-chat')
  async startChatroom(
    @Param() params,
    @Headers('Authorization') authorization,
  ) {
    let user_id = await this.userService.authorize(authorization)
    let input = object({
      params: object({
        job_id: id(),
      }),
    }).parse({ params })
    return this.chatService.startChatroom({
      job_id: input.params.job_id,
      user_id,
    })
  }

  @Post(':contract_id/contract/real-finish-time')
  async createRealFinishTime(
    @Param('contract_id') contract_id,
    @Headers('Authorization') authorization,
  ) {
    let user_id = await this.userService.authorize(authorization)
    return this.chatService.createRealFinishTime(+contract_id)
  }

  @Post(':contract_id/contract/confirm-finish-time')
  async createConfirmFinishTime(
    @Param('contract_id') contract_id,
    @Headers('Authorization') authorization,
  ) {
    let user_id = await this.userService.authorize(authorization)
    return this.chatService.createConfirmFinishTime(+contract_id)
  }
}
