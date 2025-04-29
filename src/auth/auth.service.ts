import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/create-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

const SALT = 10;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(signUpDto: SignUpDto) {
    const { email, name, password } = signUpDto;
    // Create a new user
    const hashedPassword = await bcrypt.hash(password, SALT);

    const user = new this.userModel({ email, name, password: hashedPassword });

    const savedUser = await user.save();

    // Generate JWT
    const payload = {
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return { savedUser, accessToken };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
