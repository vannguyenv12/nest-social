import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reaction } from './schemas/reaction.schema';
import { Model } from 'mongoose';
import { AddReactionDto } from 'src/post/dto/add-reaction.dto';

@Injectable()
export class ReactionService {
  constructor(
    @InjectModel(Reaction.name) private reactionModel: Model<Reaction>,
  ) {}

  create(createReactionDto: AddReactionDto, currentUser: IUserPayload) {
    const reaction = new this.reactionModel({
      post: createReactionDto.postId,
      type: createReactionDto.type,
      user: currentUser._id,
    });

    return reaction.save();
  }

  findAll() {
    return `This action returns all reaction`;
  }

  findExisting(postId: string, userId: string) {
    return this.reactionModel.findOne({ post: postId, user: userId });
  }

  findOne(id: number) {
    return `This action returns a #${id} reaction`;
  }

  async update(id: string, type: IReactionType) {
    const reaction = await this.reactionModel.findByIdAndUpdate(
      id,
      { type },
      { new: true },
    );

    if (!reaction) throw new NotFoundException('Reaction not found');

    return reaction;
  }

  remove(id: number) {
    return `This action removes a #${id} reaction`;
  }
}
