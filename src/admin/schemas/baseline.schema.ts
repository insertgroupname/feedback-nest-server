import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Timestamp } from 'typeorm';
import { Document } from 'mongoose';

export type BaselineDocument = Baseline & Document;

@Schema()
export class Baseline {
  @Prop({ default: () => new Date() })
  createDate: Date;

  @Prop()
  avgWPM: number;
  
  @Prop()
  avgDisfluencyPerTotalWord: number;

  @Prop()
  avgDisfluencyPerVideoLength: number;

  @Prop()
  avgDisfluencyPerSilence: number;

  @Prop()
  avgSilencePerVideoLength: number;
  
}

export const BaselineSchema = SchemaFactory.createForClass(Baseline);
