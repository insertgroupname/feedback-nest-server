import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RecordController } from './record.controller';

import { Record, RecordSchema } from './record.schema';
import { Report, ReportSchema } from './report.schema';

import { RecordService } from './record.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Record.name, schema: RecordSchema },
      { name: Report.name, schema: ReportSchema },
    ]),
    // MulterModule.registerAsync({}),
  ],
  providers: [RecordService],
  controllers: [RecordController],
})
export class RecordModule {}
