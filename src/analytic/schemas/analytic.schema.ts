import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnalyticDocument = Analytic & Document;

@Schema()
export class Analytic {
  @Prop({ default: () => new Date() })
  createDate: Date;

  @Prop()
  avgWPM: number;

  @Prop()
  avgDisfluencyCount: number;

  @Prop()
  avgDisfluencyPerVideoLength: number;

  @Prop()
  avgDisfluencyPerSilence: number;

  @Prop()
  avgSilencePerVideoLength: number;

  @Prop()
  totalVideo: number;

  @Prop()
  lastVideoUUID: string;
}

export const AnalyticSchema = SchemaFactory.createForClass(Analytic);
