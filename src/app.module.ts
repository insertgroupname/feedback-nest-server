import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { dbConfig } from './configs/db.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecordModule } from './records/record.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { AnalyticModule } from './analytic/analytic.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(dbConfig().connectionString),
    RecordModule,
    UserModule,
    AuthModule,
    AdminModule,
    AnalyticModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
