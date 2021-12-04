export interface BaselineInterface {
  avgWPM: number;
  avgDisfluencyPerTotalWord: number;
  avgDisfluencyPerVideoLength: number;
  avgDisfluencyPerSilence: number;
  avgSilencePerVideoLength: number;
  WPMrange: number[][];
  acceptableDisfluencyPerMinut: number;
}
