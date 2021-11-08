import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  email: string;

  @Prop()
  username: string;

  @Prop({
    default: () => {
      ['public speaking', 'rehearsal', 'presentation'];
    },
  })
  tags: string[];

  @Prop()
  stopwords: string[];

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
