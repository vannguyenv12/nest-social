import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const user1 = await this.userModel.findOne({ email: 'john@gmail.com' });
    const user2 = await this.userModel.findOne({ email: 'john1@gmail.com' });

    const newPost1 = new this.postModel({ title: 'title 1', user: user1?._id });
    const newPost2 = new this.postModel({ title: 'title 2', user: user2?._id });

    await newPost1.save();
    await newPost2.save();

    return 'This action adds a new post';
  }

  findAll() {
    return `This action returns all post`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
