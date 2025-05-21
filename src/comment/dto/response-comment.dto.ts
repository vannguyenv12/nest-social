import { Expose, Transform, Type } from 'class-transformer';
import { ObjectId } from 'src/_cores/decorators/object-id.decorator';

export class ResponseCommentDto {
  @Expose()
  @ObjectId()
  _id: string;

  @Expose()
  @ObjectId()
  @Transform(({ obj }) => obj.post)
  postId: string;
  @Expose()
  @ObjectId()
  @Transform(({ obj }) => (obj?.parent ? obj?.parent : null))
  parent: string;

  @Expose()
  @Transform(({ obj }) => obj?.userComment?._id)
  userCommentId: string;
  @Expose()
  @Transform(({ obj }) => obj?.userComment?.name)
  userCommentName: string;
  //   TODO: avatar

  @Expose()
  @Transform(({ obj }) => obj?.replyToUser?._id)
  replyToUserId: string;
  @Expose()
  @Transform(({ obj }) => obj?.replyToUser?.name)
  replyToUserName: string;
  //   TODO: avatar

  @Expose()
  content: string;

  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => ResponseCommentDto)
  replies: ResponseCommentDto[];
}
