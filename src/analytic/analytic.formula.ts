import { PostProcessingInterface } from 'src/records/report.interface';
import { RecordDocument } from 'src/records/schemas/record.schema';
import {
  AllVideoAnalyticInterface,
  AverageAnalyticInterface,
  ScoringInterface,
} from './analytic.interface';
import { AnalyticDocument } from './schemas/analytic.schema';

export const sumAvgWPM = (sum, postProcessing: PostProcessingInterface) =>
  sum + postProcessing.avg_wpm;

export const sumDisfluencyCount = (
  sum,
  postProcessing: PostProcessingInterface,
) => sum + postProcessing.hestiation_.total_count;

export const sumDisfluencyPerTotalWords = (
  sum,
  postProcessing: PostProcessingInterface,
) => sum + postProcessing.hestiation_.total_count / postProcessing.total_words;

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
  const avg = postProcessingList.reduce(formula, 0) / postProcessingList.length;
  return avg;
};

export const doAllAverage = (postProcessingList: PostProcessingInterface[]) => {
  const analyticObject: AverageAnalyticInterface = {
    avgWPM: analyticAverageFunction(sumAvgWPM, postProcessingList),

    avgDisfluencyCount: analyticAverageFunction(
      sumDisfluencyCount,
      postProcessingList,
    ),

    avgDisfluencyPerTotalWord: analyticAverageFunction(
      sumDisfluencyPerTotalWords,
      postProcessingList,
    ),

    avgDisfluencyPerVideoLength: analyticAverageFunction(
      sumDisfluencyPerVideoLength,
      postProcessingList,
    ),

    avgDisfluencyPerSilence: analyticAverageFunction(
      sumDisfluencyPerSilence,
      postProcessingList,
    ),

    avgSilencePerVideoLength: analyticAverageFunction(
      sumSilencePerVideoLength,
      postProcessingList,
    ),

    totalVideo: postProcessingList.length,
  };
  return analyticObject;
};

// [0, 59],
// [60, 139],
// [140, 170],
// [171, 200],
// [201, 500],

const wpmScoring = (wpm: number, WPMrange: number[][]) => {
  if (
    wpm < WPMrange[0][1] ||
    (wpm > (WPMrange[4][0] + WPMrange[4][1]) / 2 && wpm <= WPMrange[4][1])
  ) {
    return 1;
  } else if (
    (wpm >= WPMrange[0][1] && wpm < (WPMrange[1][0] + WPMrange[1][1]) / 2) ||
    (wpm > WPMrange[3][1] && wpm <= (WPMrange[4][0] + WPMrange[4][1]) / 2)
  ) {
    return 2;
  } else if (
    (wpm >= (WPMrange[1][0] + WPMrange[1][1]) / 2 && wpm <= WPMrange[1][1]) ||
    (wpm > (WPMrange[3][0] + WPMrange[3][1]) / 2 && wpm <= WPMrange[3][1])
  ) {
    return 3;
  } else if (
    (wpm > WPMrange[1][1] && wpm <= (WPMrange[2][0] + WPMrange[2][1]) / 2) ||
    (wpm > WPMrange[2][1] && wpm <= (WPMrange[3][0] + WPMrange[3][1]) / 2)
  ) {
    return 4;
  } else if (
    wpm >= (WPMrange[2][0] + WPMrange[2][1]) / 2 &&
    wpm <= WPMrange[2][1]
  ) {
    return 5;
  }
};

const hesitationScoring = (hesitationPerVideoLenght: number) => {
  if (hesitationPerVideoLenght >= 20) {
    return 1;
  } else if (hesitationPerVideoLenght >= 15 && hesitationPerVideoLenght < 20) {
    return 1 + (20 - hesitationPerVideoLenght) / 5;
  } else if (hesitationPerVideoLenght >= 10 && hesitationPerVideoLenght < 15) {
    return 2 + (15 - hesitationPerVideoLenght) / 5;
  } else if (hesitationPerVideoLenght >= 5 && hesitationPerVideoLenght < 10) {
    return 3 + (10 - hesitationPerVideoLenght) / 5;
  } else if (hesitationPerVideoLenght < 5) {
    return 4 + (5 - hesitationPerVideoLenght) / 5;
  }
};

const silenceScoring = (silencePerVideoLength: number) => {
  if (silencePerVideoLength >= 20) {
    return 1;
  } else if (silencePerVideoLength >= 15 && silencePerVideoLength < 20) {
    return 1 + (20 - silencePerVideoLength) / 5;
  } else if (silencePerVideoLength >= 10 && silencePerVideoLength < 15) {
    return 2 + (15 - silencePerVideoLength) / 5;
  } else if (silencePerVideoLength >= 5 && silencePerVideoLength < 10) {
    return 3 + (10 - silencePerVideoLength) / 5;
  } else if (silencePerVideoLength < 5) {
    return 4 + (5 - silencePerVideoLength) / 5;
  }
};

// prettier-ignore
export const doAvgScoring = (avgAnalytic: AverageAnalyticInterface, WPMrange=[
  [0, 59],
  [60, 139],
  [140, 170],
  [171, 200],
  [201, 500],
]) => {
  console.log(WPMrange)
  const scoreObject: ScoringInterface = {
    wpmScore: wpmScoring(avgAnalytic.avgWPM, WPMrange),
    hesitationDurationScore: hesitationScoring(avgAnalytic.avgDisfluencyPerVideoLength),
    silenceDurationScore: silenceScoring(avgAnalytic.avgSilencePerVideoLength)
  };
  return scoreObject;
};

export const doAllAnalytic = (
  postProcessingList: PostProcessingInterface[],
) => {
  const totalAnalytic: AllVideoAnalyticInterface = {
    wpm: [],
    disfluencyPerTotalWord: [],
    disfluencyPerVideoLength: [],
    disfluencyPerSilence: [],
    silencePerVideoLength: [],
  };
  postProcessingList.map((postProcessing) => {
    totalAnalytic.wpm.push({
      videoUUID: postProcessing.videoUUID,
      videoName: postProcessing.videoName,
      avgWPM: postProcessing.avg_wpm,
    });
    totalAnalytic.disfluencyPerTotalWord.push({
      videoUUID: postProcessing.videoUUID,
      videoName: postProcessing.videoName,
      disfluencyCount: postProcessing.hestiation_.total_count,
      totalWord: postProcessing.total_words,
      disfluencyPerTotalWord:
        postProcessing.hestiation_.total_count / postProcessing.total_words,
    });
    totalAnalytic.disfluencyPerVideoLength.push({
      videoUUID: postProcessing.videoUUID,
      videoName: postProcessing.videoName,
      disfluencyDuration: postProcessing.hestiation_duration,
      videoLength: postProcessing.video_len,
      disfluencyPerVideoLength:
        postProcessing.hestiation_duration / postProcessing.video_len,
    });
    totalAnalytic.disfluencyPerSilence.push({
      videoUUID: postProcessing.videoUUID,
      videoName: postProcessing.videoName,
      silenceDuration: postProcessing.silence.total_silence,
      disfluencyDuration: postProcessing.hestiation_duration,
      disfluencyPersilenceDuration:
        postProcessing.hestiation_duration /
        postProcessing.silence.total_silence,
    });
    totalAnalytic.silencePerVideoLength.push({
      videoUUID: postProcessing.videoUUID,
      videoName: postProcessing.videoName,
      silenceDuration: postProcessing.silence.total_silence,
      videoLength: postProcessing.video_len,
      silencePerVideoLength:
        postProcessing.silence.total_silence / postProcessing.video_len,
    });
  });
  return totalAnalytic;
};
