import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';
import { Record, RecordDocument } from './schemas/record.schema';

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
  ): Promise<RecordDocument[]> {
    return await this.recordModel.find(
      queryObject,
      project || {},
      queryOptions || {},
    );
  }

  async findOne(queryObject: any, project?: any): Promise<Record> {
    return await this.recordModel.findOne(queryObject, project || {});
  }

  async findById(id: string): Promise<Record> {
    return await this.recordModel.findById(id);
  }
  
  async findOneAndDelete(filterObject: any) {
    return await this.recordModel.findOneAndDelete(filterObject);
  }

  async insertOne(insertObject: any): Promise<Record[]> {
    return await this.recordModel.insertMany(insertObject);
  }

  async updateOne(filterObject: any, updateObject: any) {
    return await this.recordModel.updateOne(filterObject, updateObject);
  }

  async updateAll(filterObject: any, updateObject: any, queryOptions?: QueryOptions) {
    return await this.recordModel.updateMany(filterObject, updateObject, queryOptions || {});
  }
}
