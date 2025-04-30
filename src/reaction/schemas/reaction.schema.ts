import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { PostDocument } from 'src/post/schemas/post.schema';
import { UserDocument } from 'src/user/schemas/user.schema';

export type ReactionDocument = HydratedDocument<Reaction>;

@Schema({ timestamps: true })
export class Reaction {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: UserDocument;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
  post: PostDocument;
  @Prop({
    enum: ['like', 'wow', 'haha', 'happy', 'love', 'angry'],
    default: 'like',
  })
  type: IReactionType;
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);
