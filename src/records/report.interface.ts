export interface TranscriptInterface {
  transcript: string;
  confident: number;
  timestamps: [];
  word_confident: [];
}

export interface PostProcessingInterface {
  video_len: number;
  start_process_time: number;
  end_process_time: number;
  // eslint-disable-next-line @typescript-eslint/ban-types
  wpm: object;
  avg_wpm: number;
  silence: { total_silence: number; silence_list: [] };
  // eslint-disable-next-line @typescript-eslint/ban-types
  hesiation_: { marker: object; totalcount: string };
  total_words: number;
  word_frequency: { word: []; bigram: [] };
  // eslint-disable-next-line @typescript-eslint/ban-types
  vocab: object;
  len_unique_word: number;
  keyword: string[];
}
