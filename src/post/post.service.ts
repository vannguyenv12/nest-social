import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { UploadMediaDto } from './dto/upload-media.dto';
import { DeleteMediaDto } from './dto/delete-media.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  create(createPostDto: CreatePostDto, currentUser: IUserPayload) {
    const newPost = new this.postModel({
      ...createPostDto,
      author: currentUser,
    });

    return newPost.save();
  }

  async uploadMedia(id: string, uploadMediaDtos: UploadMediaDto[]) {
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException('Post not found');

    uploadMediaDtos.forEach((mediaDto) => {
      post.mediaFiles.push(mediaDto);
    });

    await post.save();
  }

  async removeMedia(id: string, deleteMediaDto: DeleteMediaDto) {
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException('Post not found');

    post.mediaFiles = post.mediaFiles.filter(
      (mediaFile) => mediaFile.public_id !== deleteMediaDto.mediaId,
    );

    await post.save();
  }

  findAll() {
    return this.postModel.find().populate('author');
  }

  findOne(id: string) {
    return this.postModel.findById(id);
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.postModel.findByIdAndUpdate(id, updatePostDto, {
      new: true,
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async remove(id: string) {
    const post = await this.postModel.findByIdAndDelete(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }
  }
}
