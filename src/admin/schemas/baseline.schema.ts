import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Timestamp } from 'typeorm';
import { Document } from 'mongoose';

export type BaselineDocument = Baseline & Document;

@Schema()
export class Baseline {
  @Prop({ default: () => new Date() })
  createDate: Date;

  // @Prop({ required: true })
  // avgWPM: number;

  // @Prop({ required: true })
  // avgDisfluencyPerTotalWord: number;

  // @Prop({ required: true })
  // avgDisfluencyPerVideoLength: number;

  // @Prop({ required: true })
  // avgDisfluencyPerSilence: number;

  // @Prop({ required: true })
  // avgSilencePerVideoLength: number;

  @Prop({
    default: () => {
      return [
        [0, 59],
        [60, 139],
        [140, 170],
        [171, 200],
        [201, 500],
      ];
    },
  })
  WPMrange: number[][];

  @Prop({ default: () => 2 })
  acceptableDisfluencyPerMinut: number;
}

export const BaselineSchema = SchemaFactory.createForClass(Baseline);
