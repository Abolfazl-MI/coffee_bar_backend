import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../schemas/user.schema';
import { Model } from 'mongoose';
import { LoginDto } from '../../dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../types/jwt.type';
import { RegisterDto } from '../../dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<string> {
    const user: User = await this.userModel.findOne({
      email: loginDto.email,
    });
    if (!user) {
      throw new BadRequestException('user not found with provided info');
    }
    const matchPassword: boolean = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!matchPassword) {
      throw new BadRequestException('provided credentials are not valid');
    }
    return this.genToken(user);
  }

  async register(registerData: RegisterDto, avatar?: string): Promise<string> {
    // check if email exist
    const userExists: User = await this.userModel.findOne({
      email: registerData.email,
    });
    if (userExists) {
      throw new BadRequestException('email already in use');
    }
    const salt: string = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(registerData.password, salt);
    delete registerData.password;
    const userData = {
      ...registerData,
      password: hashedPassword,
    };
    if (avatar) {
      userData['avatar'] = avatar;
    }
    const user = await this.userModel.create(userData);
    return this.genToken(user);
  }

  private genToken(user: User): string {
    const userId = user._id.toString();
    // generate jwt
    const payload: JwtPayload = {
      role: user.role,
      id: userId,
    };
    return this.jwtService.sign(payload);
  }
}
