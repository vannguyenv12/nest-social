import { Expose } from 'class-transformer';

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
}
