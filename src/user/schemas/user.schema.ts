import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MediaType } from 'src/_cores/globals/class';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  email: string;
  @Prop()
  name: string;
  @Prop()
  password: string;
  @Prop({ default: 'user' })
  role: IRole;

  @Prop()
  bio?: string;
  @Prop()
  avatar?: MediaType;
  @Prop()
  coverPhoto?: MediaType;
  @Prop()
  birthdate?: Date;
  @Prop()
  phoneNumber?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
