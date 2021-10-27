export class UpdateUserDto {
  tags: string[];
  stopWords: string[];

  constructor(tags: string[], stopWords: string[]) {
    this.tags = tags;
    this.stopWords = stopWords;
  }
}
