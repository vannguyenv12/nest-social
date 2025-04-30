import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import { Model } from 'mongoose';
import { UploadMediaDto } from './dto/upload-media.dto';
import { DeleteMediaDto } from './dto/delete-media.dto';
import { AddReactionDto } from './dto/add-reaction.dto';
import { ReactionService } from 'src/reaction/reaction.service';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    private reactionService: ReactionService,
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

  async addReaction(addReactionDto: AddReactionDto, currentUser: IUserPayload) {
    const { postId, type } = addReactionDto;
    const existingReaction = await this.reactionService.findExisting(
      postId,
      currentUser._id,
    );

    if (existingReaction) {
      // NOT DO ANYTHING IF new reaction === existingReaction
      if (type === existingReaction.type) return;
      // Update with the new reaction
      await this.reactionService.update(existingReaction._id.toString(), type);
    } else {
      // Create the reaction for post
      await this.reactionService.create(addReactionDto, currentUser);
    }

    // UPDATE REACTION COUNTS
  }
}
