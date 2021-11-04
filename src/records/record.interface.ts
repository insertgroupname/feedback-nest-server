export interface RecordInterface {
  userId: string;
  videoName: string;
  videoUUID: string;
  tags: string[];
  description?: string;
  createDate?: Date;
  lastUpdate?: Date;
  status?: string;
}

export interface UpdateInterface {
  videoName?: string;
  tags?: string[];
  description?: string;
}
