import { Expose, Transform, Type } from 'class-transformer';
import { ObjectId } from 'src/_cores/decorators/object-id.decorator';
import { PostDocument } from '../schemas/post.schema';

// https://res.cloudinary.com/dir7wnely/image/upload/v1746002210/oecsqxrwxsxxyjmawzlz.png

export class MediaType {
  @Expose()
  @Transform(
    ({ obj }) =>
      `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/image/upload/v${obj.version}/${obj.display_name}.${obj.format}`,
  )
  url: string;
  @Expose()
  public_id: string;
  @Expose()
  version: number;
  @Expose()
  display_name: string;
  @Expose()
  format: string;
  @Expose()
  resource_type: string;
}

export class ResponsePostDto {
  @Expose()
  @ObjectId()
  _id: string;
  @Expose()
  backgroundColor: string;
  @Expose()
  content: string;
  @Expose()
  @Transform(({ obj }) => obj.reactionsCount)
  reactionsCount: Map<IReactionType, number>;
  @Expose()
  @Type(() => MediaType)
  mediaFiles: MediaType[];
  @Expose()
  privacy: IPrivacy;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;

  // Custom property
  @Expose()
  @Transform(({ obj }: { obj: PostDocument }) => obj?.author?._id)
  authorId: string;
  @Expose()
  @Transform(({ obj }: { obj: PostDocument }) => obj?.author?.name)
  authorName: string;
  @Expose()
  @Transform(({ obj }: { obj: PostDocument }) => obj?.author?.email)
  authorEmail: string;
}
