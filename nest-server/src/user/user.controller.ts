import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { UserService } from './user.service'
import { email, id, int, object, string } from 'cast.ts'
import * as forge from 'node-forge'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile/:id')
  getProfile(@Param() params) {
    let input = object({
      params: object({
        id: id(),
      }),
    }).parse({ params })
    return this.userService.getProfile(input.params.id)
  }

  @Patch(':profile')
  async updateProfile(@Body() body) {
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
    }).parse({ body })
    let isMatching = forge.pki.ed25519.verify({
      signature: input.body.signature,
      message: JSON.stringify(input.body.payload),
      encoding: 'utf8',
      publicKey: input.body.publicKey,
    })
    let user_id = await this.userService.getUserIdByPublicKey(
      input.body.publicKey,
    )
    return this.userService.updateProfile(user_id, input.body.payload)
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'uploads/',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(
            Math.random() * 1e9,
          )}`
          const filename = `${uniqueSuffix}-${file.originalname}`
          callback(null, filename)
        },
      }),
      limits: {
        fileSize: 1024 * 1024, // Maximum file size in bytes (e.g., 1MB)
      },

      fileFilter: (req, file, callback) => {
        const allowedFileTypes = ['.jpg', '.jpeg', '.png', '.pdf']
        const ext = extname(file.originalname).toLowerCase()
        if (allowedFileTypes.includes(ext)) {
          callback(null, true)
        } else {
          callback(
            new Error('Only PDF, JPG, JPEG, and PNG files are allowed'),
            true,
          )
        }
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file)
  }

  @Post('signup')
  async signup(@Body() body) {
    let input = object({
      body: object({
        email: email(),
        username: string(),
        fullname: string(),
        hkid: string(),
        // cardnumber: string(),
        hk_phone: string(),
      }),
    }).parse({ body })
    let result = await this.userService.signup(input.body)
    return result
  }
}
