import { Expose, Transform } from 'class-transformer';
import { ObjectId } from 'src/_cores/decorators/object-id.decorator';

export class ResponseFriendDto {
  @Expose()
  @ObjectId()
  _id: string;
  @Expose()
  name: string;
  @Expose()
  @Transform(({ obj }) =>
    obj?.avatar?.public_id
      ? `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/image/upload/v${obj?.avatar?.version}/${obj?.avatar?.display_name}.${obj?.avatar?.format}`
      : null,
  )
  avatarUrl: string;
}
