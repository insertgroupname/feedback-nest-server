import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      await bcrypt.genSalt(),
    );
    const createdUser = await this.userModel.create(createUserDto);
    const sanitizedUser = this.sanitize(createdUser);
    return sanitizedUser;
  }

  async updateOne(filterObject: any, updateObject: any) {
    return await this.userModel.updateOne(filterObject, updateObject);
  }

  async findOne(queryObj: any, projectionObj?: any) {
    return this.userModel.findOne(queryObj, projectionObj);
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id);
  }

  sanitize(user: UserDocument) {
    const sanitized = user.toObject();
    delete sanitized['password'];
    return sanitized;
  }
}
