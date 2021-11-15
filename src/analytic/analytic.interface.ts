export interface AnalyticInterface {
  avgWPM: number;
  avgDisfluencyCount: number;
  avgDisfluencyPerVideoLength: number;
  avgDisfluencyPerSilence: number;
  avgSilencePerVideoLength: number;
  totalVideo: number;
  lastVideoUUID: string;
}
