import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import { Model } from 'mongoose';
import { UploadMediaDto } from 'src/_cores/globals/dtos';
import { DeleteMediaDto } from './dto/delete-media.dto';
import { AddReactionDto } from './dto/add-reaction.dto';
import { ReactionService } from 'src/reaction/reaction.service';
import { RemoveReactionDto } from './dto/remove-reaction.dto';
import { PostGateway } from './post.gateway';
import { plainToInstance } from 'class-transformer';
import { ResponsePostDto } from './dto/response-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    private reactionService: ReactionService,
    private postGateway: PostGateway,
  ) {}

  async create(createPostDto: CreatePostDto, currentUser: IUserPayload) {
    const newPost = new this.postModel({
      ...createPostDto,
      author: currentUser,
    });

    const savedPost = await newPost.save();

    const responsePost = plainToInstance(ResponsePostDto, savedPost, {
      excludeExtraneousValues: true,
    });

    this.postGateway.handlePostCreate(responsePost);

    return savedPost;
  }

  async uploadMedia(id: string, uploadMediaDtos: UploadMediaDto[]) {
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException('Post not found');

    uploadMediaDtos.forEach((mediaDto) => {
      post.mediaFiles.push(mediaDto);
    });

    await post.save();

    this.postGateway.handleUploadMedia(id, uploadMediaDtos);
  }

  async removeMedia(id: string, deleteMediaDto: DeleteMediaDto) {
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException('Post not found');

    post.mediaFiles = post.mediaFiles.filter(
      (mediaFile) => mediaFile.public_id !== deleteMediaDto.mediaId,
    );

    await post.save();

    this.postGateway.handleRemoveMedia(id, deleteMediaDto.mediaId);
  }

  async findAll(currentUser: IUserPayload, limit: number, cursor: string) {
    const query: Record<string, object> = {};
    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    const posts = await this.postModel
      .find(query)
      .populate('author')
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .lean();

    const hasNextPage = posts.length > limit;
    const items = hasNextPage ? posts.slice(0, 1) : posts;

    const postsWithReaction = await Promise.all(
      items.map(async (post) => {
        const myReaction = await this.reactionService.findExisting(
          post._id.toString(),
          currentUser._id,
        );

        return { ...post, myReaction: myReaction?.type };
      }),
    );

    return {
      items: postsWithReaction,
      hasNextPage,
      cursor: hasNextPage ? items[items.length - 1].createdAt : null,
    };
  }

  async findOne(id: string) {
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException('Post not found');

    return post;
  }

  findOneWithReaction(id: string) {
    return this.reactionService.findPostReaction(id);
  }

  async findOneWithMyReaction(id: string, currentUser: IUserPayload) {
    const post = await this.postModel.findById(id).lean();
    if (!post) throw new NotFoundException('Post not found');

    const myReaction = await this.reactionService.findExisting(
      post._id.toString(),
      currentUser._id,
    );

    // return post;
    return { ...post, myReaction: myReaction?.type };
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.postModel.findByIdAndUpdate(id, updatePostDto, {
      new: true,
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    this.postGateway.handlePostUpdate({
      postId: id,
      backgroundColor: post.backgroundColor,
      content: post.content,
      privacy: post.privacy,
    });

    return post;
  }

  async remove(id: string) {
    const post = await this.postModel.findByIdAndDelete(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    this.postGateway.handleRemovePost(id);
  }

  async addReaction(addReactionDto: AddReactionDto, currentUser: IUserPayload) {
    const { postId, type } = addReactionDto;
    const post = await this.findOne(postId);

    const existingReaction = await this.reactionService.findExisting(
      postId,
      currentUser._id,
    );

    let oldReactionType: IReactionType | null = null;

    if (existingReaction) {
      // NOT DO ANYTHING IF new reaction === existingReaction
      if (type === existingReaction.type) return;
      // Update with the new reaction
      oldReactionType = existingReaction.type;
      await this.reactionService.update(existingReaction._id.toString(), type);
    } else {
      // Create the reaction for post
      await this.reactionService.create(addReactionDto, currentUser);
    }

    // *** UPDATE REACTION COUNTS
    const reactionCounts = post.reactionsCount;
    // decrease count
    if (oldReactionType) {
      const value = reactionCounts.get(oldReactionType) || 0;
      reactionCounts.set(oldReactionType, value - 1 >= 0 ? value - 1 : 0);
    }
    // increase count
    const value = reactionCounts.get(type) || 0;
    reactionCounts.set(type, value + 1);

    post.reactionsCount = reactionCounts;
    const savedPost = await post.save();

    const responsePost = plainToInstance(ResponsePostDto, savedPost, {
      excludeExtraneousValues: true,
    });

    this.postGateway.handleAddReaction(responsePost);
  }

  async removeReaction(
    removeReactionDto: RemoveReactionDto,
    currentUser: IUserPayload,
  ) {
    const { postId } = removeReactionDto;
    const post = await this.findOne(postId);

    const existingReaction = await this.reactionService.findExisting(
      postId,
      currentUser._id,
    );

    if (!existingReaction) return;

    await this.reactionService.remove(existingReaction._id.toString());

    const savedPost = await this.postModel.findByIdAndUpdate(
      post._id,
      {
        $inc: { [`reactionsCount.${existingReaction.type}`]: -1 },
      },
      { new: true },
    );

    const responsePostDto = plainToInstance(ResponsePostDto, savedPost, {
      excludeExtraneousValues: true,
    });
    this.postGateway.handleRemoveReaction(responsePostDto);
  }
}
