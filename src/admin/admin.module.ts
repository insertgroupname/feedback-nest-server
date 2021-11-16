import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { RecordModule } from 'src/records/record.module';
import { AnalyticModule } from 'src/analytic/analytic.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Baseline, BaselineSchema } from './schemas/baseline.schema';

@Module({
  imports: [
    RecordModule,
    AnalyticModule,
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: Baseline.name, schema: BaselineSchema, collection: 'baseline' },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
