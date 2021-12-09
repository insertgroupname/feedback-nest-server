import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RecordController } from './record.controller';
import { Record, RecordSchema } from './schemas/record.schema';
import { RecordService } from './record.service';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Record.name, schema: RecordSchema, collection: 'records' },
    ]),
    forwardRef(() => AdminModule),
  ],
  providers: [RecordService],
  controllers: [RecordController],
  exports: [RecordService],
})
export class RecordModule {}
