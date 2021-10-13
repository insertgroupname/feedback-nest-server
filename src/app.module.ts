import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

// import appConfig from './configs/app.config';
import { dbConfig } from './configs/db.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecordModule } from './records/record.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(dbConfig().connectionString),
    RecordModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
