import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Timestamp } from 'typeorm';
import { Report } from './report.schema';
import { Document } from 'mongoose';

export type RecordDocument = Record & Document;

@Schema()
export class Record {
  @Prop()
  userId: string;

  @Prop()
  videoName: string;

  @Prop()
  videoUUID: string;

  @Prop()
  description: string;

  @Prop()
  tags: string[];

  @Prop()
  stopwords: string[];

  @Prop({ default: () => new Date() })
  createDate: Date;

  @Prop({ default: () => new Date() })
  lastUpdate: Date;

  @Prop()
  status: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Prop({ type: Report })
  report?: Report;
}

export const RecordSchema = SchemaFactory.createForClass(Record);
