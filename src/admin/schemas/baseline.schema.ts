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

  @Prop({
    Default: () => [
      [0, 59],
      [60, 139],
      [140, 170],
      [171, 200],
      [201, 500],
    ],
  })
  WPMrange: number[][];

  @Prop({ default: () => 2 })
  acceptableDisfluencyPerMinut: number;
}

export const BaselineSchema = SchemaFactory.createForClass(Baseline);
