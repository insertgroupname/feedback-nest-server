export interface RecordInterface {
  userId: string;
  videoName: string;
  videoUUID: string;
  tags: string[];
  createDate?: Date;
  lastUpdate?: Date;
  status?: string;
}
