import { Module } from '@nestjs/common';
import { AnalyticService } from './analytic.service';
import { AnalyticController } from './analytic.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Analytic, AnalyticSchema } from './schemas/analytic.schema';
import { RecordModule } from 'src/records/record.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Analytic.name, schema: AnalyticSchema, collection: 'analytic' },
    ]),
    RecordModule,
  ],
  controllers: [AnalyticController],
  providers: [AnalyticService],
  exports: [AnalyticService],
})
export class AnalyticModule {}
