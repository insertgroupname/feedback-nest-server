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
  wpm: { videoUUID: string; avgWPM: number }[];
  disfluencyPerTotalWord: {
    videoUUID: string;
    disfluencyCount: number;
    totalWord: number;
    disfluencyPerTotalWord: number;
  }[];
  disfluencyPerSilence: {
    videoUUID: string;
    silenceDuration: number;
    videoLength: number;
    disfluencyPersilenceDuration: number;
  }[];
  disfluencyPerVideoLength: {
    videoUUID: string;
    disfluencyDuration: number;
    videoLength: number;
    disfluencyPerVideoLength: number;
  }[];
  silencePerVideoLength: {
    videoUUID: string;
    silenceDuration: number;
    videoLength: number;
    silencePerVideoLength: number;
  }[];
}
