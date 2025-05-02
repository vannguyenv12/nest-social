import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CurrentUser } from 'src/_cores/decorators/current-user.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { FriendRequest } from './schemas/friend-request.schemas';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FriendService {
  constructor(
    @InjectModel(FriendRequest.name)
    private friendRequestModel: Model<FriendRequest>,
    private userService: UserService,
  ) {}

  async create(@CurrentUser() currentUser: IUserPayload, receiverId: string) {
    // receiver user exist
    const receiver = await this.userService.findOne(receiverId);
    // Prevent send a request to yourself
    if (currentUser._id === receiver._id.toString())
      throw new BadRequestException('Cannot send a friend request to yourself');

    // Prevent duplicate the same friend
    const existingFriendRequest = await this.friendRequestModel.findOne({
      sender: currentUser._id,
      receiver: receiver._id,
      status: { $in: ['pending', 'accept'] },
    });

    if (existingFriendRequest)
      throw new BadRequestException('The friend request already sent');

    const friendRequest = new this.friendRequestModel({
      sender: currentUser._id,
      receiver: receiver._id,
      status: 'pending',
    });

    return friendRequest.save();
  }

  async acceptFriendRequest(
    @CurrentUser() currentUser: IUserPayload,
    friendRequestId: string,
  ) {
    const friendRequest =
      await this.friendRequestModel.findById(friendRequestId);

    if (!friendRequest) {
      throw new NotFoundException('Friend request not found');
    }

    if (friendRequest.status !== 'pending') {
      throw new BadRequestException('Request already handled');
    }

    if (currentUser._id !== friendRequest.receiver._id.toString()) {
      throw new ForbiddenException();
    }

    friendRequest.status = 'accept';
    await friendRequest.save();

    await this.userService.addFriend(
      friendRequest.sender._id.toString(),
      friendRequest.receiver._id.toString(),
    );

    await this.userService.addFriend(
      friendRequest.receiver._id.toString(),
      friendRequest.sender._id.toString(),
    );
  }

  async rejectFriendRequest(
    @CurrentUser() currentUser: IUserPayload,
    friendRequestId: string,
  ) {
    const friendRequest =
      await this.friendRequestModel.findById(friendRequestId);

    if (!friendRequest) {
      throw new NotFoundException('Friend request not found');
    }

    if (friendRequest.status !== 'pending') {
      throw new BadRequestException('Request already handled');
    }

    if (currentUser._id !== friendRequest.receiver._id.toString()) {
      throw new ForbiddenException();
    }

    friendRequest.status = 'reject';
    await friendRequest.save();
  }

  getCurrentRequestPending(currentUser: IUserPayload) {
    return this.friendRequestModel
      .find({
        receiver: currentUser._id,
        status: 'pending',
      })
      .populate('sender', 'name email avatar')
      .populate('receiver', 'name email avatar');
  }

  getCurrentFriends(currentUser: IUserPayload) {
    return this.userService.getFriends(currentUser._id);
  }

  async remove(@CurrentUser() currentUser: IUserPayload, receiverId: string) {
    const receiver = await this.userService.findOne(receiverId);

    const friendRequest = await this.friendRequestModel.findOne({
      sender: currentUser._id,
      receiver: receiver._id,
      status: 'pending',
    });

    if (!friendRequest)
      throw new NotFoundException('Friend request does not exist');

    await friendRequest.deleteOne();
  }
}
