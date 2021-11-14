import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { RecordModule } from 'src/records/record.module';

@Module({
  imports: [RecordModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
