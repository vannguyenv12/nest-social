import { Expose } from 'class-transformer';

export class ResponseUserDto {
  @Expose()
  _id: string;
  @Expose()
  name: string;
  @Expose()
  email: string;
}
