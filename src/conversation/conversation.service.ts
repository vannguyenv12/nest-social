import { Injectable } from '@nestjs/common';
import { CreateGroupConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { CreatePrivateConversationDto } from './dto/create-private-conversation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation } from './schemas/conversation.schema';
import { Model } from 'mongoose';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
  ) {}

  async createPrivate(
    createPrivateConversationDto: CreatePrivateConversationDto,
    currentUser: IUserPayload,
  ) {
    const { participantId } = createPrivateConversationDto;

    const existingConversation = await this.conversationModel.findOne({
      isGroup: false,
      participants: { $all: [currentUser._id, participantId] },
    });

    if (existingConversation) return existingConversation;

    const conversation = new this.conversationModel({
      isGroup: false,
      participants: [currentUser._id, participantId],
    });

    return conversation.save();
  }

  createGroup(
    createGroupConversationDto: CreateGroupConversationDto,
    currentUser: IUserPayload,
  ) {
    const { groupAvatar, groupName, participantIds } =
      createGroupConversationDto;

    const conversation = new this.conversationModel({
      isGroup: true,
      participants: [currentUser._id, ...participantIds],
      groupName,
      groupAvatar,
      groupOwner: currentUser._id,
    });

    return conversation.save();
  }

  findAll() {
    return `This action returns all conversation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} conversation`;
  }

  update(id: number, updateConversationDto: UpdateConversationDto) {
    return `This action updates a #${id} conversation`;
  }

  remove(id: number) {
    return `This action removes a #${id} conversation`;
  }
}
