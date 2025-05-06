import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './schemas/comment.schema';
import { Model, Types } from 'mongoose';
import { PostService } from 'src/post/post.service';
import { UserService } from 'src/user/user.service';
import { CommentGateway } from './comment.gateway';
import { transformDto } from 'src/_cores/utils/transform-dto.utils';
import { ResponseCommentDto } from './dto/response-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    private postService: PostService,
    private userService: UserService,
    private commentGateway: CommentGateway,
  ) {}

  async create(createCommentDto: CreateCommentDto, currentUser: IUserPayload) {
    const { postId, content, parentCommentId, replyToUserId } =
      createCommentDto;
    const post = await this.postService.findOne(postId);

    let realParentCommentId: Types.ObjectId | null = null;
    let realReplyToUserId: Types.ObjectId | null = null;

    if (replyToUserId) {
      const replyToUser = await this.userService.findOne(replyToUserId);
      realReplyToUserId = replyToUser._id;
    }

    if (parentCommentId) {
      const parentComment = await this.commentModel.findById(parentCommentId);

      if (!parentComment) {
        throw new NotFoundException('Parent comment does not exist');
      }

      realParentCommentId = parentComment.parent?._id
        ? parentComment.parent?._id
        : parentComment._id;
    }

    const comment = new this.commentModel({
      content,
      post,
      userComment: currentUser._id,
      parent: realParentCommentId,
      replyToUser: realReplyToUserId,
    });

    const savedComment = await comment.save();

    // TODO: EMIT EVENT
    const populatedComment = await this.findOne(savedComment._id.toString());
    const responseCommentDto = transformDto(
      ResponseCommentDto,
      populatedComment,
    );

    this.commentGateway.handleCommentCreate(postId, responseCommentDto);
  }

  async getComments(postId: string) {
    const comments = await this.commentModel
      .find({ post: postId })
      .populate('userComment')
      .populate('replyToUser')
      .lean();

    const finalResult: any[] = [];

    for (const comment of comments) {
      if (!comment.parent) {
        finalResult.push({ ...comment, replies: [] });
      } else {
        const foundRootComment = finalResult.find(
          (c) => c._id.toString() === comment.parent?._id.toString(),
        );

        if (foundRootComment) {
          foundRootComment.replies.push(comment);
        }
      }
    }

    return finalResult;
  }

  findAll() {
    return `This action returns all comment`;
  }

  async findOne(id: string) {
    const comment = await this.commentModel
      .findById(id)
      .populate('userComment')
      .populate('replyToUser');

    if (!comment) throw new NotFoundException('Comment not found');

    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    const comment = await this.commentModel.findByIdAndUpdate(
      id,
      { content: updateCommentDto.content },
      { new: true },
    );

    if (!comment) throw new NotFoundException('Comment not found');

    return comment;

    // TODO: EMIT EVENT
  }

  async remove(id: string) {
    const comment = await this.commentModel.findByIdAndDelete(id);
    if (!comment) throw new NotFoundException('Comment not found');

    if (!comment.parent) {
      await this.commentModel.deleteMany({ parent: comment._id });
    }

    // TODO: EMIT EVENT
  }
}
