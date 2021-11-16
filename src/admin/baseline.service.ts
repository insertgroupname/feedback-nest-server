import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';
import { BaselineInterface } from './baseline.interface';
import { Baseline, BaselineDocument } from './schemas/baseline.schema';

@Injectable()
export class BaselineService {
  constructor(
    @InjectModel(Baseline.name)
    private readonly baselineModel: Model<BaselineDocument>,
  ) {}

  async create(baselineObject: BaselineInterface) {
    return this.baselineModel.create(baselineObject);
  }

  async findAll(
    queryObject: any,
    project?: any,
    queryOptions?: QueryOptions,
  ): Promise<BaselineDocument[]> {
    return await this.baselineModel.find(
      queryObject,
      project || {},
      queryOptions || {},
    );
  }
}
