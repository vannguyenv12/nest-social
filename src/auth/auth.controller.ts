import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/create-auth.dto';
import { TransformDTO } from 'src/_cores/interceptors/transform-dto.interceptor';
import { ResponseAuthDto } from './dto/response-auth.dto';

@Controller('auth')
@TransformDTO(ResponseAuthDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  create(@Body() signUpDto: SignUpDto) {
    return this.authService.create(signUpDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
