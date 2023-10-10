import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  Param,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { email, id, int, object, string } from 'cast.ts';
import forge from 'node-forge';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id/profile')
  getProfile(@Param() params) {
    let input = object({
      params: object({
        id: id(),
      }),
    }).parse({ params });
    return this.userService.getProfile(input.params.id);
  }

  @Patch(':profile')
  updateProfile(@Body() body) {
    let input = object({
      body: object({
        payload: object({
          email: email(),
          desc: string(),
          nickname: string(),
          timestamp: int(),
        }),
        publicKey: string(),
        signature: string(),
      }),
    }).parse({ body });
    let isMatching = forge.pki.ed25519.verify({
      signature: input.body.signature,
      message: JSON.stringify(input.body.payload),
      encoding: 'utf8',
      publicKey: input.body.publicKey,
    });
    // return this.userService.updateProfile(user_id, input.body.payload);
  }
}
