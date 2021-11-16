export interface AnalyticInterface {
  avgWPM: number;
  avgDisfluencyCount: number;
  avgDisfluencyPerTotalWord: number;
  avgDisfluencyPerVideoLength: number;
  avgDisfluencyPerSilence: number;
  avgSilencePerVideoLength: number;
  totalVideo: number;
  lastVideoUUID?: string;
}
