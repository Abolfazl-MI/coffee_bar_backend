import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { FileInterceptor, NoFilesInterceptor } from "@nestjs/platform-express";
import { appStorage, fileSizeLimitation } from '../utils/multer.config';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseInterceptors(NoFilesInterceptor())
  async login(@Body() body: LoginDto) {
    const token= await this.authService.login(body);
    return {
      token
    }
  }

  @Post('register')
  @UseInterceptors(FileInterceptor('avatar', { storage: appStorage }))
  async register(
    @Body() body: RegisterDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: fileSizeLimitation }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<object> {
    const token = await this.authService.register(
      body,
      file ? file.path : null,
    );
    return {
      token,
    };
  }
}
