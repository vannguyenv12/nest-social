import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGroupConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { CreatePrivateConversationDto } from './dto/create-private-conversation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation } from './schemas/conversation.schema';
import { Model } from 'mongoose';
import { AddParticipantsDto } from './dto/add-participants.dto';
import { UserService } from 'src/user/user.service';
import { UserDocument } from 'src/user/schemas/user.schema';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
    private userService: UserService,
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

  async findAll(currentUser: IUserPayload, limit: number, cursor: string) {
    const query: Record<string, any> = {
      participants: { $in: [currentUser._id] },
    };

    if (cursor) {
      query.updatedAt = { $lt: new Date(cursor) };
    }

    const conversations = await this.conversationModel
      .find(query)
      .populate('lastMessage')
      .sort({ updatedAt: -1 })
      .limit(limit + 1)
      .populate('groupOwner', 'email name')
      .lean();

    const hasNextPage = conversations.length > limit;
    const items = hasNextPage ? conversations.slice(0, 1) : conversations;

    return {
      items,
      hasNextPage,
      cursor: hasNextPage ? items[items.length - 1].updatedAt : null,
    };
  }

  async findOne(id: string) {
    const conversation = await this.conversationModel
      .findById(id)
      .populate('participants');

    if (!conversation) throw new NotFoundException('Conversation not found');

    return conversation;
  }

  async update(
    id: string,
    updateConversationDto: UpdateConversationDto,
    currentUser: IUserPayload,
  ) {
    const { groupName, groupAvatar } = updateConversationDto;

    const conversation = await this.conversationModel.findById(id);
    if (!conversation) throw new NotFoundException('Conversation not found');
    if (currentUser._id !== conversation.groupOwner?._id.toString()) {
      throw new ForbiddenException();
    }

    conversation.groupAvatar = groupAvatar || conversation.groupAvatar;
    conversation.groupName = groupName || conversation.groupName;
    await conversation.save();
  }

  async addParticipants(
    id: string,
    addParticipantsDto: AddParticipantsDto,
    currentUser: IUserPayload,
  ) {
    const { participantIds } = addParticipantsDto;

    const conversation = await this.conversationModel.findById(id);
    if (!conversation || !conversation.isGroup) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.groupOwner?._id?.toString() !== currentUser._id) {
      throw new ForbiddenException();
    }

    const existingParticipantIds = conversation.participants.map((p) =>
      p._id.toString(),
    );

    const participants: UserDocument[] = [];

    for (const participantId of participantIds) {
      if (!existingParticipantIds.includes(participantId)) {
        const user = await this.userService.findOne(participantId);
        participants.push(user);
      }
    }

    conversation.participants = [...conversation.participants, ...participants];

    await conversation.save();
  }

  async removeParticipants(
    id: string,
    removeParticipantsDto: AddParticipantsDto,
    currentUser: IUserPayload,
  ) {
    const { participantIds } = removeParticipantsDto;

    const conversation = await this.conversationModel.findById(id);
    if (!conversation || !conversation.isGroup) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.groupOwner?._id?.toString() !== currentUser._id) {
      throw new ForbiddenException();
    }

    if (participantIds.includes(currentUser._id)) {
      throw new BadRequestException('Cannot remove owner');
    }

    const filteredParticipants = conversation.participants.filter(
      (p) => !participantIds.includes(p._id.toString()),
    );

    conversation.participants = filteredParticipants;
    await conversation.save();
  }

  remove(id: number) {
    return `This action removes a #${id} conversation`;
  }
}
