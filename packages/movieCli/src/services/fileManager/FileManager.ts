import fs from 'fs';
import { cloneDeep, omit, set } from 'lodash';
import path from 'path';
import { pipeline } from 'stream';
import { isDeepStrictEqual, promisify } from 'util';
import type * as T from './FileManager.types';

export class FileManager {
  public constructor(private readonly dir: string) {}

  public async getMovieData(imdbId: string) {
    const filePath = this.getMovieDataFilePath(imdbId);
    const data = fs.existsSync(filePath) ? <T.GetIndexResponse>JSON.parse(fs.readFileSync(filePath, 'utf-8')) : null;
    return data;
  }

  public async writeMovieData(data: T.WriteMovieDataInputMovie, timestamp: string) {
    const filePath = this.getMovieDataFilePath(data.imdbId);
    await this.writeJsonFile(filePath, data, timestamp);
    return filePath;
  }

  public async writeSubtitleData(imdbId: string, data: T.WriteSubtitleDataInputSubtitle, timestamp: string) {
    const filePath = this.getSubtitleDataFilePath(imdbId, data.subtitleId);
    await this.writeJsonFile(filePath, data, timestamp);
    return filePath;
  }

  public async writeSubtitleText(imdbId: string, data: T.WriteSubtitleDataInputSubtitle, text: string, _timestamp: string) {
    const filePath = this.getSubtitleTextFilePath(imdbId, data.subtitleId, data.subTextFileName);
    await this.writeTextFile(filePath, text);
    return filePath;
  }

  public async writePoster(imdbId: string, posterFileName: string, posterUrl: string) {
    const rootDir = path.resolve(this.dir, imdbId);
    const posterFile = path.resolve(rootDir, posterFileName);
    await this.writeImageFile(posterFile, posterUrl);
    return posterFile;
  }

  private getMovieDir(imdbId: string) {
    const rootDir = path.resolve(this.dir, imdbId);
    return rootDir;
  }

  private getSubtitlesDir(imdbId: string, subtitleId: string) {
    const movieDir = this.getMovieDir(imdbId);
    const subtitlesDir = path.resolve(movieDir, 'subtitles', subtitleId);
    return subtitlesDir;
  }

  private getMovieDataFilePath(imdbId: string) {
    const rootDir = this.getMovieDir(imdbId);
    const filePath = path.resolve(rootDir, 'index.json');
    return filePath;
  }

  private getSubtitleDataFilePath(imdbId: string, subtitleId: string) {
    const subtitlesDir = this.getSubtitlesDir(imdbId, subtitleId);
    const filePath = path.resolve(subtitlesDir, 'index.json');
    return filePath;
  }

  private getSubtitleTextFilePath(imdbId: string, subtitleId: string, fileName: string) {
    const subtitlesDir = this.getSubtitlesDir(imdbId, subtitleId);
    const filePath = path.resolve(subtitlesDir, fileName);
    return filePath;
  }

  private async writeImageFile(filePath: string, url: string) {
    this.ensureDir(filePath);
    const response = await fetch(url);
    const fileStream = fs.createWriteStream(filePath);
    await promisify(pipeline)(response.body as unknown as NodeJS.ReadableStream, fileStream);
  }

  private async writeTextFile(filePath: string, fileContent: string) {
    this.ensureDir(filePath);
    fs.writeFileSync(filePath, fileContent);
  }

  private async writeJsonFile(filePath: string, fileContent: any, timestamp: string) {
    this.ensureDir(filePath);

    const newFileContent = cloneDeep(fileContent);
    set(newFileContent, ['lastSynced'], timestamp);

    if (fs.existsSync(filePath)) {
      const currFileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const currFileContentRaw = omit(currFileContent, ['lastSynced', 'lastModified']);
      const newFileContentRaw = omit(newFileContent, ['lastSynced', 'lastModified']);
      if (isDeepStrictEqual(currFileContentRaw, newFileContentRaw)) {
        set(newFileContent, ['lastModified'], currFileContent.lastModified ?? timestamp);
      } else {
        set(newFileContent, ['lastModified'], timestamp);
      }
    } else {
      set(newFileContent, ['lastModified'], timestamp);
    }

    fs.writeFileSync(filePath, JSON.stringify(newFileContent, null, 2));
  }

  private ensureDir(filePath: string) {
    fs.mkdirSync(path.resolve(filePath, '..'), { recursive: true });
  }
}
