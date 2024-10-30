import crypto from 'crypto';
import fs from 'fs';
import { filter, map } from 'lodash';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import type * as T from './FileManager.types';

export class FileManager {
  public constructor(private readonly dir: string) {}

  public async writeQueryIndex(data: T.WriteIndexDataInputMovie, userId: string, timestamp: string) {
    const filePath = this.getQueryIndexFilePath(data.pageNumber);
    await this.writeJsonFile(filePath, data);
    await this.writeLog('WRITE_INDEX', {}, userId, timestamp);
    return filePath;
  }

  public async writeMovieData(data: T.WriteMovieDataInputMovie, userId: string, timestamp: string) {
    const filePath = this.getMovieDataFilePath(data.imdbId);
    await this.writeJsonFile(filePath, { ...data, isAvailable: true });
    await this.writeLog('WRITE_MOVIE_DATA', { imdbId: data.imdbId }, userId, timestamp);
    return filePath;
  }

  public async writePoster(imdbId: string, posterFileName: string, posterUrl: string, userId: string, timestamp: string) {
    const posterFile = this.getPosterFilePath(imdbId, posterFileName);
    await this.writeImageFile(posterFile, posterUrl);
    await this.writeLog('WRITE_POSTER', { imdbId, posterFileName }, userId, timestamp);
    return posterFile;
  }

  public async writeSubtitleData(imdbId: string, data: T.WriteSubtitleDataInputSubtitle, userId: string, timestamp: string) {
    const filePath = this.getSubtitleDataFilePath(imdbId, data.subtitleId);
    await this.writeJsonFile(filePath, data);
    await this.writeLog('WRITE_Subtitle_DATA', { imdbId, subtitleId: data.subtitleId }, userId, timestamp);
    return filePath;
  }

  public async writeSubtitleText(imdbId: string, data: T.WriteSubtitleDataInputSubtitle, text: string, userId: string, timestamp: string) {
    const filePath = this.getSubtitleTextFilePath(imdbId, data.subtitleId, data.subtextFileName);
    await this.writeTextFile(filePath, text);
    await this.writeLog('WRITE_Subtitle_TEXT', { imdbId, subtitleId: data.subtitleId }, userId, timestamp);
    return filePath;
  }

  public async getAllMovieIds(): Promise<string[]> {
    const moviesRootDir = this.getMoviesRootDir();
    const entries = await fs.promises.readdir(moviesRootDir, { withFileTypes: true });
    const directories = filter(entries, (e) => e.isDirectory());
    const movieIds = map(directories, (d) => d.name);
    return movieIds;
  }

  public async deleteAllQueries(): Promise<void> {
    const indexDir = this.getQueryDir();
    await fs.promises.rm(indexDir, { recursive: true, force: true });
  }

  public async getMovieData(imdbId: string): Promise<T.GetMovieDataResponse | null> {
    const filePath = this.getMovieDataFilePath(imdbId);
    const data = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf-8')) : null;
    return data;
  }

  public async removeMovieData(imdbId: string, userId: string, timestamp: string) {
    const movieDir = this.getMovieDir(imdbId);
    const filePath = this.getMovieDataFilePath(imdbId);
    const data = fs.existsSync(filePath) ? <T.GetMovieDataResponse>JSON.parse(fs.readFileSync(filePath, 'utf-8')) : null;
    if (data !== null) {
      await this.writeJsonFile(filePath, { ...data, isAvailable: false });
      await this.writeLog('REMOVE_MOVIE_DATA', { imdbId }, userId, timestamp);
    }

    return movieDir;
  }

  private async writeLog(action: string, data: any, userId: string, timestamp: string) {
    // const filePath = this.getLogFilePath(timestamp);
    // await this.writeJsonFile(filePath, { action, ...data, userId, timestamp });
  }

  private getMoviesRootDir() {
    const filePath = path.resolve(this.dir, 'movies');
    return filePath;
  }

  private getQueryDir() {
    const filePath = path.resolve(this.dir, 'queries');
    return filePath;
  }

  private getQueryIndexFilePath(pageNumber: number) {
    const queryDir = this.getQueryDir();
    const filePath = path.resolve(queryDir, 'release-date-asc', pageNumber.toString(), 'index.json');
    return filePath;
  }

  private getMovieDir(imdbId: string) {
    const movieRootDir = this.getMoviesRootDir();
    const movieDir = path.resolve(movieRootDir, imdbId);
    return movieDir;
  }

  private getLogDir() {
    const logDir = path.resolve(this.dir, 'logs');
    return logDir;
  }

  private getLogFilePath(timestamp: string) {
    const timestampFormatted = timestamp.replace(/-/g, '').replace(/[:.]/g, '').replace('T', '').replace('Z', '');
    const randomHex = crypto.randomBytes(4).toString('hex');
    const movieLogDir = this.getLogDir();
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
