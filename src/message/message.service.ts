import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateMessageDto } from './dto/update-message.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/message.schema';
import { Model } from 'mongoose';
import { ConversationService } from 'src/conversation/conversation.service';
import { UserService } from 'src/user/user.service';
import { MessageGateway } from './message.gateway';
import { plainToInstance } from 'class-transformer';
import { ResponseMessageDto } from './dto/response-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
    private conversationService: ConversationService,
    private userService: UserService,
    private messageGateway: MessageGateway,
  ) {}

  async getAllMessages(conversationId: string, limit: number, cursor: string) {
    const query: Record<string, any> = {
      conversation: conversationId,
    };

    if (cursor) {
      query.createdAt = { $gt: new Date(cursor) };
    }

    const messages = await this.messageModel
      .find(query)
      .sort({ createdAt: 1 })
      .limit(limit + 1)
      .populate('sender', 'name avatar')
      .populate('seenBy', 'name avatar');

    const hasNextPage = messages.length > limit;
    const items = hasNextPage ? messages.slice(0, 1) : messages;

    return {
      items,
      hasNextPage,
      cursor: hasNextPage ? items[items.length - 1].createdAt : null,
    };
  }

  async findOne(id: string) {
    const message = await this.messageModel.findOne({
      _id: id,
      isDelete: false,
    });
    if (!message) throw new NotFoundException('Message not found');

    return message;
  }

  async sendMessage(
    conversationId: string,
    sendMessageDto: SendMessageDto,
    currentUser: IUserPayload,
  ) {
    const { text, mediaFiles } = sendMessageDto;

    const message = new this.messageModel({
      conversation: conversationId,
      sender: currentUser._id,
      text,
      mediaFiles,
      seenBy: [currentUser._id],
    });

    const savedMessage = await message.save();

    // Update last message in conversation
    await this.conversationService.updateLastMessage(
      conversationId,
      savedMessage._id.toString(),
    );

    const newMessage = await this.messageModel
      .findById(savedMessage._id)
      .populate('sender', 'name avatar')
      .populate('seenBy', 'name avatar');

    // convert savedMessage into ResponseMessageDto
    const responseMessage = plainToInstance(ResponseMessageDto, newMessage, {
      excludeExtraneousValues: true,
    });

    // TODO: Real time
    this.messageGateway.handleNewMessage(conversationId, responseMessage);
  }

  async update(
    id: string,
    updateMessageDto: UpdateMessageDto,
    currentUser: IUserPayload,
  ) {
    const { text, mediaFiles } = updateMessageDto;

    const message = await this.findOne(id);

    if (message.sender._id.toString() !== currentUser._id) {
      throw new ForbiddenException();
    }

    message.text = text || message.text;
    message.mediaFiles = mediaFiles || message.mediaFiles;

    await message.save();
  }

  async remove(id: string, currentUser: IUserPayload) {
    const message = await this.findOne(id);

    if (message.sender._id.toString() !== currentUser._id) {
      throw new ForbiddenException();
    }

    message.isDelete = true;
    await message.save();
  }

  async markSeenMessage(id: string, currentUser: IUserPayload) {
    const message = await this.findOne(id);

    const alreadySeen = message.seenBy.some(
      (u) => u._id.toString() === currentUser._id,
    );

    if (!alreadySeen) {
      const user = await this.userService.findOne(currentUser._id);
      message.seenBy.push(user);
      await message.save();
    }
  }
}
