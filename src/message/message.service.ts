import { Injectable } from '@nestjs/common';
import { UpdateMessageDto } from './dto/update-message.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/message.schema';
import { Model } from 'mongoose';
import { ConversationService } from 'src/conversation/conversation.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
    private conversationService: ConversationService,
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

    // TODO: Real time
  }

  findAll() {
    return `This action returns all message`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
