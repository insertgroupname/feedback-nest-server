import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { RecordModule } from 'src/records/record.module';
import { AnalyticModule } from 'src/analytic/analytic.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Baseline, BaselineSchema } from './schemas/baseline.schema';
import { BaselineService } from './baseline.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Baseline.name, schema: BaselineSchema, collection: 'baseline' },
    ]),
    RecordModule,
    AnalyticModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AdminController],
  providers: [AdminService, BaselineService],
})
export class AdminModule {}
