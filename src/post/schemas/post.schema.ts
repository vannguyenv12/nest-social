import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserDocument } from 'src/user/schemas/user.schema';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
  @Prop()
  title: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: UserDocument;
}

export const PostSchema = SchemaFactory.createForClass(Post);
