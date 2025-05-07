import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './schemas/notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
  ) {}

  async create(
    senderId: string,
    receiverId: string,
    type: INotificationType,
    content: string,
    linkToId?: string,
  ) {
    const notification = new this.notificationModel({
      sender: senderId,
      receiver: receiverId,
      type,
      content,
      linkToId,
    });

    await notification.save();
    // TODO: REAL TIME
  }

  findAll(currentUser: IUserPayload) {
    return this.notificationModel
      .find({ receiver: currentUser._id })
      .populate('sender', 'name avatar');
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
