import { PostProcessingInterface } from 'src/records/report.interface';
import { RecordDocument } from 'src/records/schemas/record.schema';
import { AnalyticDocument } from './schemas/analytic.schema';

export const sumAvgWPM = (sum, postProcessing: PostProcessingInterface) =>
  sum + postProcessing.avg_wpm;

export const sumDisfluencyCount = (
  sum,
  postProcessing: PostProcessingInterface,
) => sum + postProcessing.hestiation_.total_count;

export const sumDisfluencyPerVideoLength = (
  sum,
  postProcessing: PostProcessingInterface,
) => sum + postProcessing.hestiation_duration / postProcessing.video_len;

// prettier-ignore
export const sumDisfluencyPerSilence = (
  sum,
  postProcessing: PostProcessingInterface,
) =>
  sum +
  postProcessing.hestiation_duration /
    (postProcessing.silence.total_silence === 0 ? 1 : postProcessing.silence.total_silence);

export const sumSilencePerVideoLength = (
  sum,
  postProcessing: PostProcessingInterface,
) => sum + postProcessing.silence.total_silence / postProcessing.video_len;

export const analyticAverageFunction = (
  formula: any,
  postProcessingList: PostProcessingInterface[] | any,
) => {
  const avg = postProcessingList.reduce(formula,0) / postProcessingList.length;
  return avg;
};
