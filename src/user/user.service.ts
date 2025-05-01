import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  async getCurrentUser(currentUser: IUserPayload) {
    const user = await this.userModel.findById(currentUser._id);
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User does not exist');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      {
        ...updateUserDto,
      },
      { new: true },
    );

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
