import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';
import { Record, RecordDocument } from './record.schema';

@Injectable()
export class RecordService {
  constructor(
    @InjectModel(Record.name)
    private readonly recordModel: Model<RecordDocument>,
  ) {}

  async findAll(
    queryObject: any,
    project?: any,
    queryOptions?: QueryOptions,
  ): Promise<Record[]> {
    return await this.recordModel.find(
      queryObject,
      project || {},
      queryOptions || {},
    );
  }

  async findOne(queryObject: any, project?: any): Promise<Record> {
    return await this.recordModel.findOne(queryObject, project || {});
  }

  async insertOne(insertObject: any): Promise<Record[]> {
    return await this.recordModel.insertMany(insertObject);
  }
}
