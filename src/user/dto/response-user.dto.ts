import { Expose } from 'class-transformer';
import { ObjectId } from 'src/_cores/decorators/object-id.decorator';

export class ResponseUserDto {
  @Expose()
  @ObjectId()
  _id: string;
  @Expose()
  name: string;
  @Expose()
  email: string;
  @Expose()
  role: string;
  @Expose()
  bio: string;
  @Expose()
  birthdate: Date;
  @Expose()
  phoneNumber: string;
  @Expose()
  isActive: boolean;
}
