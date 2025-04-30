import { Expose, Transform } from 'class-transformer';
import { PostDocument } from '../schemas/post.schema';

export class ResponsePostDto {
  @Expose()
  _id: string;
  @Expose()
  backgroundColor: string;
  @Expose()
  content: string;
  @Expose()
  mediaUrls: string[];
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
