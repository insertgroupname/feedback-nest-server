export interface AverageAnalyticInterface {
  avgWPM: number;
  avgDisfluencyCount: number;
  avgDisfluencyPerTotalWord: number;
  avgDisfluencyPerVideoLength: number;
  avgDisfluencyPerSilence: number;
  avgSilencePerVideoLength: number;
  totalVideo: number;
  lastVideoUUID?: string;
}

export interface ScoringInterface {
  wpmScore: number;
  hesitationDurationScore: number;
  silenceDurationScore: number;
}

export interface AllVideoAnalyticInterface {
  wpm: { videoUUID: string; videoName: string; avgWPM: number }[];
  disfluencyPerTotalWord: {
    videoUUID: string;
    videoName: string;
    disfluencyCount: number;
    totalWord: number;
    disfluencyPerTotalWord: number;
  }[];
  disfluencyPerSilence: {
    videoUUID: string;
    videoName: string;
    silenceDuration: number;
    disfluencyDuration: number;
    disfluencyPersilenceDuration: number;
  }[];
  disfluencyPerVideoLength: {
    videoUUID: string;
    videoName: string;
    disfluencyDuration: number;
    videoLength: number;
    disfluencyPerVideoLength: number;
  }[];
  silencePerVideoLength: {
    videoUUID: string;
    videoName: string;
    silenceDuration: number;
    videoLength: number;
    silencePerVideoLength: number;
  }[];
}
