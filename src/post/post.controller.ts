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
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from 'src/_cores/guards/auth.guard';
import { RoleGuard } from 'src/_cores/guards/role.guard';
import { Roles } from 'src/_cores/decorators/role.decorator';
import { TransformDTO } from 'src/_cores/interceptors/transform-dto.interceptor';
import { ResponsePostDto } from './dto/response-post.dto';
import { CurrentUser } from 'src/_cores/decorators/current-user.decorator';
import { ParseObjectIdPipe } from 'src/_cores/pipes/parse-object-id.pipe';

@Controller('posts')
@TransformDTO(ResponsePostDto)
@UseGuards(AuthGuard, RoleGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() currentUser: IUserPayload,
  ) {
    return this.postService.create(createPostDto, currentUser);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'user')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.postService.remove(id);
  }
}
