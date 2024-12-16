import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/types/jwt.type';
import { User } from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const headers: IncomingHttpHeaders = request.headers;
    // if not contains authorization
    if (!headers.authorization || !headers.authorization.startsWith('Bearer')) {
      throw new UnauthorizedException('you cant access this route');
    }
    const token: string = headers.authorization.split(' ')[1];
    try {
      //validate token
      const payload: JwtPayload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      const user: User = await this.userModel.findById(payload.id);
      if (!user) {
        throw new UnauthorizedException('user not found');
      }
      request['user'] = user;
      return true;
    } catch (e) {
        throw new UnauthorizedException('expired or invalid token')
    }
  }
}
