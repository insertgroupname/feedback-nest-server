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
  tags: string[];

  @Prop({ type: Timestamp, default: () => new Date() })
  createDate: Date;

  @Prop({ type: Timestamp, default: () => new Date() })
  lastUpdate: Date;

  @Prop()
  status: string;

  @Prop((type) => Report)
  report?: Report;
}

export const RecordSchema = SchemaFactory.createForClass(Record);
