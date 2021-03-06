import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';
import { PostProcessingInterface } from 'src/records/report.interface';

import { RecordDocument } from 'src/records/schemas/record.schema';
import { AverageAnalyticInterface } from './analytic.interface';
import { Analytic, AnalyticDocument } from './schemas/analytic.schema';
import * as af from './analytic.formula';
@Injectable()
export class AnalyticService {
  constructor(
    @InjectModel(Analytic.name)
    private readonly analyticModel: Model<AnalyticDocument>,
  ) {}
  async create(recordDocumentList: RecordDocument[]) {
    const postProcessingList: PostProcessingInterface[] =
      recordDocumentList.map((record) => record.report.postProcessing);
    const analyticObject: AverageAnalyticInterface =
      af.doAllAverage(postProcessingList);
    analyticObject.lastVideoUUID = recordDocumentList[0].videoUUID;
    return this.analyticModel.create(analyticObject);
  }

  async find(
    queryObject: any,
    project?: any,
    queryOptions?: QueryOptions,
  ): Promise<AnalyticDocument[]> {
    return await this.analyticModel.find(
      queryObject,
      project || {},
      queryOptions || {},
    );
  }
}
