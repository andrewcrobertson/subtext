import fs from 'fs';
import { join, map, padStart, random } from 'lodash';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import type * as T from './FileManager.types';

export class FileManager {
  public constructor(private readonly dir: string) {}

  public async writeMovieData(data: T.WriteMovieDataInputMovie, userId: string, timestamp: string) {
    const filePath = this.getMovieDataFilePath(data.imdbId);
    await this.writeJsonFile(filePath, data);
    await this.writeLog(data.imdbId, 'WRITE_MOVIE_DATA', {}, userId, timestamp);
    return filePath;
  }

  public async writePoster(imdbId: string, posterFileName: string, posterUrl: string, userId: string, timestamp: string) {
    const posterFile = this.getPosterFilePath(imdbId, posterFileName);
    await this.writeImageFile(posterFile, posterUrl);
    await this.writeLog(imdbId, 'WRITE_POSTER', { posterFileName }, userId, timestamp);
    return posterFile;
  }

  public async writeSubtitleData(imdbId: string, data: T.WriteSubtitleDataInputSubtitle, userId: string, timestamp: string) {
    const filePath = this.getSubtitleDataFilePath(imdbId, data.subtitleId);
    await this.writeJsonFile(filePath, data);
    await this.writeLog(imdbId, 'WRITE_SUBTITLE_DATA', { subtitleId: data.subtitleId }, userId, timestamp);
    return filePath;
  }

  public async writeSubtitleText(imdbId: string, data: T.WriteSubtitleDataInputSubtitle, text: string, userId: string, timestamp: string) {
    const filePath = this.getSubtitleTextFilePath(imdbId, data.subtitleId, data.subTextFileName);
    await this.writeTextFile(filePath, text);
    await this.writeLog(imdbId, 'WRITE_SUBTITLE_TEXT', { subtitleId: data.subtitleId }, userId, timestamp);
    return filePath;
  }

  public async getMovieData(imdbId: string) {
    const filePath = this.getMovieDataFilePath(imdbId);
    const data = fs.existsSync(filePath) ? <T.GetMovieDataResponse>JSON.parse(fs.readFileSync(filePath, 'utf-8')) : null;
    return data;
  }

  public async removeMovieData(imdbId: string, userId: string, timestamp: string) {
    const movieDir = this.getMovieDir(imdbId);
    await fs.promises.rm(movieDir, { recursive: true, force: true });
    await this.writeLog(imdbId, 'REMOVE_MOVIE_DATA', {}, userId, timestamp);
    return movieDir;
  }

  private async writeLog(imdbId: string, text: string, data: any, userId: string, timestamp: string) {
    const filePath = this.getMovieLogFilePath(imdbId, timestamp);
    await this.writeJsonFile(filePath, { imdbId, text, ...data, userId, timestamp });
  }

  private getMovieDir(imdbId: string) {
    const movieDir = path.resolve(this.dir, imdbId);
    return movieDir;
  }

  private getMovieLogDir(imdbId: string) {
    const movieDir = this.getMovieDir(imdbId);
    const movieLogDir = path.resolve(movieDir, 'logs');
    return movieLogDir;
  }

  private getMovieLogFilePath(imdbId: string, timestamp: string) {
    const timestampFormatted = timestamp.replace(/[:.]/g, '').replace('T', '').replace('Z', '');
    const randomHex = join(map(Array(2), padStart(random(0, 255).toString(16), 2, '0')), '');
    const movieLogDir = this.getMovieLogDir(imdbId);
    const filePath = path.resolve(movieLogDir, `${timestampFormatted}.${randomHex}.json`);
    return filePath;
  }

  private getMovieDataFilePath(imdbId: string) {
    const movieDir = this.getMovieDir(imdbId);
    const filePath = path.resolve(movieDir, 'index.json');
    return filePath;
  }

  private getPosterFilePath(imdbId: string, posterFileName: string) {
    const movieDir = this.getMovieDir(imdbId);
    const filePath = path.resolve(movieDir, posterFileName);
    return filePath;
  }

  private getSubtitlesDir(imdbId: string, subtitleId: string) {
    const movieDir = this.getMovieDir(imdbId);
    const subtitlesDir = path.resolve(movieDir, 'subtitles', subtitleId);
    return subtitlesDir;
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

  private async writeJsonFile(filePath: string, fileContent: any) {
    this.ensureDir(filePath);
    fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2));
  }

  private ensureDir(filePath: string) {
    fs.mkdirSync(path.resolve(filePath, '..'), { recursive: true });
  }
}
