import { Body, Controller, Post, Get, Headers, Query } from '@nestjs/common'
import { ChatService } from './chat.service'
import { UserService } from '../user/user.service'
import { int, object, string } from 'cast.ts'

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
  ) {}

  @Post('content')
  async content(@Body() body, @Headers('Authorization') authorization) {
    let user_id = await this.userService.authorize(authorization)
    let input = object({
      body: object({
        contract_id: int(),
        // updated_at: int(),
        content: string(),
        user_id: int(),
      }),
    }).parse({ body })
    const result = await this.chatService.content(input.body)
    return result[0]
  }

  @Get('content2')
  async getContent(
    @Headers('Authorization') authorization,
    @Query('contract_id') contract_id,
  ) {
    let user_id = await this.userService.authorize(authorization)

    return this.chatService.getMessage(31)
    return this.chatService.getMessage(contract_id)
  }
}
