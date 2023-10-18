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
import { id, int, object, string } from 'cast.ts'

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
    const result = await this.chatService.sendMessage({
      chatroom_id: input.params.chatroom_id,
      content: input.body.content,
      user_id,
    })
    return result[0]
  }

  @Get(':chatroom_id/messages')
  async getContent(
    @Headers('Authorization') authorization,
    @Param('chatroom_id') chatroom_id,
  ) {
    let user_id = await this.userService.authorize(authorization)
    // 获取消息
    return await this.chatService.getMessage(chatroom_id)

    // return {
    //   contract_id: contract_id,
    //   messages: messages,
    // }
    return this.chatService.getMessage(1)
    // return this.chatService.getMessage(contract_id)
  }

  @Get('chatroom')
  async getChatroom(@Headers('Authorization') authorization) {
    let user_id = await this.userService.authorize(authorization)
    // 获取消息
    return await this.chatService.getChatroom(user_id)
  }
}
