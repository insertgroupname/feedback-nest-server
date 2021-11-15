import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { RecordModule } from 'src/records/record.module';
import { AnalyticModule } from 'src/analytic/analytic.module';

@Module({
  imports: [RecordModule, AnalyticModule, ScheduleModule.forRoot()],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
