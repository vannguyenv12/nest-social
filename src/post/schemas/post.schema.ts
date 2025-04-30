import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserDocument } from 'src/user/schemas/user.schema';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: UserDocument;
  @Prop({ default: '#fff' })
  backgroundColor: string;
  @Prop()
  content: string;
  @Prop()
  mediaUrls?: string[];
  @Prop({ enum: ['public', 'private', 'friends'], default: 'public' })
  privacy: IPrivacy;
}

export const PostSchema = SchemaFactory.createForClass(Post);
