import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/_cores/guards/auth.guard';
import { Request } from 'express';
import { CurrentUser } from 'src/_cores/decorators/current-user.decorator';
import { TransformDTO } from 'src/_cores/interceptors/transform-dto.interceptor';
import { ResponseUserDto } from './dto/response-user.dto';
import { RoleGuard } from 'src/_cores/guards/role.guard';
import { Roles } from 'src/_cores/decorators/role.decorator';

@Controller('users')
@UseGuards(AuthGuard, RoleGuard)
@TransformDTO(ResponseUserDto)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/profile')
  getCurrentUser(@CurrentUser() currentUser: IUserPayload) {
    return currentUser;
  }

  @Post()
  @Roles('admin')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles('admin')
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'user')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'user')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
