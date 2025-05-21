import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Post,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/_cores/guards/auth.guard';
import { Request } from 'express';
import { CurrentUser } from 'src/_cores/decorators/current-user.decorator';
import { TransformDTO } from 'src/_cores/interceptors/transform-dto.interceptor';
import { ResponseUserDto } from './dto/response-user.dto';
import { RoleGuard } from 'src/_cores/guards/role.guard';
import { Roles } from 'src/_cores/decorators/role.decorator';
import { ParseObjectIdPipe } from 'src/_cores/pipes/parse-object-id.pipe';
import { UploadMediaDto } from 'src/_cores/globals/dtos';

@Controller('users')
@UseGuards(AuthGuard, RoleGuard)
@TransformDTO(ResponseUserDto)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/profile')
  getCurrentUser(@CurrentUser() currentUser: IUserPayload) {
    return this.userService.getCurrentUser(currentUser._id);
  }

  @Post('/upload-avatar')
  uploadAvatar(
    @Body() uploadMediaDto: UploadMediaDto,
    @CurrentUser() currentUser: IUserPayload,
  ) {
    return this.userService.uploadAvatar(uploadMediaDto, currentUser);
  }

  @Post('/upload-cover')
  uploadCoverPhoto(
    @Body() uploadMediaDto: UploadMediaDto,
    @CurrentUser() currentUser: IUserPayload,
  ) {
    return this.userService.uploadCoverPhoto(uploadMediaDto, currentUser);
  }

  @Get()
  findAll(
    @Query('q') q: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('cursor') cursor: string,
    @CurrentUser() currentUser: IUserPayload,
  ) {
    return this.userService.findAll(currentUser, q, limit, cursor);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'user')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.userService.remove(id);
  }
}
