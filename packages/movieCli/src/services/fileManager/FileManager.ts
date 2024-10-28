import fs from 'fs';
import { cloneDeep, omit, set } from 'lodash';
import path from 'path';
import { pipeline } from 'stream';
import { isDeepStrictEqual, promisify } from 'util';
import type * as T from './FileManager.types';

export class FileManager {
  public constructor(private readonly dir: string) {}

  public async getMovieData(imdbId: string) {
    const rootDir = path.resolve(this.dir, imdbId);
    const file = path.resolve(rootDir, 'index.json');
    const data = fs.existsSync(file) ? <T.GetIndexResponse>JSON.parse(fs.readFileSync(file, 'utf-8')) : null;
    return data;
  }

  public async writeMovieData(data: T.WriteMovieDataInputMovie, timestamp: string) {
    const rootDir = path.resolve(this.dir, data.imdbId);
    const file = path.resolve(rootDir, 'index.json');
    await this.writeJsonFile(file, data, timestamp);
    return file;
  }

  public async writeSubtitleData(imdbId: string, data: T.WriteSubtitleDataInputSubtitle, timestamp: string) {
    const rootDir = path.resolve(this.dir, imdbId, 'subtitles', data.subtitleId);
    const file = path.resolve(rootDir, 'index.json');
    await this.writeJsonFile(file, data, timestamp);
    return file;
  }

  public async writeSubtitleText(imdbId: string, data: T.WriteSubtitleDataInputSubtitle, text: string, timestamp: string) {
    const rootDir = path.resolve(this.dir, imdbId, 'subtitles', data.subtitleId);
    const file = path.resolve(rootDir, data.subTextFileName);
    await this.writeTextFile(file, text);
    return file;
  }

  public async writePoster(imdbId: string, posterFileName: string, posterUrl: string) {
    const rootDir = path.resolve(this.dir, imdbId);
    const posterFile = path.resolve(rootDir, posterFileName);
    await this.writeImageFile(posterFile, posterUrl);
    return posterFile;
  }

  public async writeImageFile(filePath: string, url: string) {
    this.ensureDir(filePath);
    const response = await fetch(url);
    const fileStream = fs.createWriteStream(filePath);
    await promisify(pipeline)(response.body as unknown as NodeJS.ReadableStream, fileStream);
  }

  public async writeTextFile(filePath: string, fileContent: string) {
    this.ensureDir(filePath);
    fs.writeFileSync(filePath, fileContent);
  }

  public async writeJsonFile(filePath: string, fileContent: any, timestamp: string) {
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
