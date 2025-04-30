import { Expose, Transform } from 'class-transformer';
import { MediaType, PostDocument } from '../schemas/post.schema';
import { ObjectId } from 'src/_cores/decorators/object-id.decorator';

export class ResponsePostDto {
  @Expose()
  @ObjectId()
  _id: string;
  @Expose()
  backgroundColor: string;
  @Expose()
  content: string;
  @Expose()
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
