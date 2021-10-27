import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import {
  PostProcessingInterface,
  TranscriptInterface,
} from '../report.interface';

import { Document } from 'mongoose';

export type ReportDocument = Report & Document;

export class Report {
  @Prop()
  transcript: TranscriptInterface[];

  @Prop()
  postProcessing: PostProcessingInterface[];
}

export const ReportSchema = SchemaFactory.createForClass(Report);
