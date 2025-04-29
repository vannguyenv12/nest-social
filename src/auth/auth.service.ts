import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';

const SALT = 10;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, name, password } = signUpDto;

    const userByEmail = await this.userModel.findOne({ email });
    if (userByEmail) {
      throw new BadRequestException('Email already in use!');
    }

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

    return { user: savedUser, accessToken };
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    // 1) Find user by email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('Bad Credentials');
    }
    // 2) Check for password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new NotFoundException('Bad Credentials');
    }
    // 3) Generate JWT
    // Generate JWT
    const payload = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return { user, accessToken };
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
