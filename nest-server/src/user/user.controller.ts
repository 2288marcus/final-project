import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  NotImplementedException,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { UserService } from './user.service'
import { email, id, int, number, object, string, values } from 'cast.ts'
import * as forge from 'node-forge'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  async getSelfProfile(@Headers('Authorization') authorization) {
    let user_id = await this.userService.authorize(authorization)
    return this.userService.getSelfProfile(user_id)
  }

  @Get(':id/profile')
  getProfile(@Param() params) {
    let input = object({
      params: object({
        id: id(),
      }),
    }).parse({ params })
    return this.userService.getPublicProfile(input.params.id)
  }

  @Patch('profile/:field')
  async updateProfile(
    @Body() body,
    @Param() params,
    @Headers('Authorization') authorization,
  ) {
    let user_id = await this.userService.authorize(authorization)

    let input = object({
      params: object({
        field: values([
          'username' as const,
          'email' as const,
          'hk_phone' as const,
          'description' as const,
        ]),
      }),
      body: object({
        value: string(),
      }),
    }).parse({ body, params })

    return this.userService.updateProfile({
      user_id,
      field: input.params.field,
      value: input.body.value,
    })
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

  @Post('signUp')
  async signUp(@Body() body) {
    let input = object({
      body: object({
        email: email(),
        username: string(),
        fullName: string(),
        hkId: string(),
        public_key: string(),
        // card: string(),
        hk_phone: string(),
      }),
    }).parse({ body })
    let result = await this.userService.signUp(input.body)
    return result
  }

  @Post('login')
  async login(@Body() body) {
    let input = object({
      body: object({
        now: number(),
        public_key: string({ trim: true }),
        signature: string(),
      }),
    }).parse({ body })
    console.log('login, input:', input)
    return await this.userService.login(input.body)
  }
}
