import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
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
      status: 'pending',
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

  findAll() {
    return `This action returns all friend`;
  }

  findOne(id: number) {
    return `This action returns a #${id} friend`;
  }

  update(id: number, updateFriendDto: UpdateFriendDto) {
    return `This action updates a #${id} friend`;
  }

  remove(id: number) {
    return `This action removes a #${id} friend`;
  }
}
