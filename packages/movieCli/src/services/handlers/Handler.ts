import { FileManager } from '$services/fileManager/FileManager';
import type { Logger } from '$services/logger/Logger';
import type { MovieReader, ReadResponseData } from '$services/movieReader/MovieReader.types';
import { parseSrt3 } from '$utils/parseSrt';
import fs from 'fs';
import * as glob from 'glob';
import { concat, isError, map } from 'lodash';
import murmurhash from 'murmurhash';
import path from 'path';
import type * as T from './Handler.types';

export class Handler {
  public constructor(
    private readonly downloader: MovieReader,
    private readonly fileManager: FileManager,
    private readonly logger: Logger
  ) {}

  public async load({ imdbId, logDir, force }: T.LoadInput) {
    const rootDir = path.resolve(logDir, imdbId);
    const subtitleDir = path.resolve(rootDir, 'subtitles');

    this.logger.infoBlank();
    this.logger.infoStarting();

    const indexFile = path.resolve(rootDir, 'index.json');
    const existingIndex = fs.existsSync(indexFile) ? <T.ToMovieResponseIndex>JSON.parse(fs.readFileSync(indexFile, 'utf-8')) : null;
    if (!force && existingIndex !== null) {
      this.logger.infoTitle(existingIndex.title, imdbId);
      this.logger.infoMovieAlreadyDownloaded();
      return;
    }

    const downloadRes = await this.downloader.read(imdbId);
    const errorText = map(downloadRes.errors, (error) => (isError(error) ? error.message : (<any>error).toString()));
    const title = downloadRes.data?.title ?? 'Unknown Title';

    this.logger.infoTitle(title, imdbId);
    for (let i = 0; i < errorText.length; i++) {
      this.logger.errorMessage(errorText[i]);
    }

    const subtitleCount = downloadRes.data?.subtitles.length ?? 0;
    this.logger.infoMovieSubtitlesFound(subtitleCount);
    const { subtitles, index } = this.toMovie(imdbId, downloadRes.data!);

    const posterUrl = downloadRes.data?.posterUrl ?? null;
    if (posterUrl !== null) {
      const posterFile = path.resolve(rootDir, index.posterFileName!);
      await this.fileManager.writeImageFile(posterFile, posterUrl);
      this.logger.infoSavedPosterFile(posterFile);
    }

    const timestamp = new Date().toISOString();
    await this.fileManager.writeJsonFile(indexFile, index, timestamp);
    this.logger.infoSavedMetaFile(indexFile);

    for (let i = 0; i < subtitles.length; i++) {
      const { subTextValue, ...meta } = subtitles[i];

      const metaFile = path.resolve(subtitleDir, meta.subTextId, 'index.json');
      await this.fileManager.writeJsonFile(metaFile, meta, timestamp);
      this.logger.infoSavedMetaFile(metaFile);

      const subtitleFile = path.resolve(subtitleDir, meta.subTextId, meta.subTextFileName);
      await this.fileManager.writeTextFile(subtitleFile, subTextValue);
      this.logger.infoSavedSubtitleFile(subtitleFile);
    }

    this.logger.infoBlank();
  }

  public async remove({ imdbId, logDir, dataDir }: T.RemoveInput) {
    this.logger.infoBlank();
    this.logger.infoStarting();

    const logFilesAll = glob.sync(`**/${imdbId}.*`, { cwd: logDir, absolute: true });
    const dataFilesAll = glob.sync(`**/${imdbId}.*`, { cwd: dataDir, absolute: true });
    const allFiles = concat(logFilesAll, dataFilesAll).sort();

    for (let i = 0; i < allFiles.length; i++) {
      fs.unlinkSync(allFiles[i]);
      this.logger.infoRemovedFile(allFiles[i]);
    }

    this.logger.infoBlank();
  }

  public async flag({ imdbId, subtitleFileName: subtitleId, logDir }: T.FlagInput) {
    this.logger.infoBlank();
    this.logger.infoStarting();
    this.logger.infoBlank();
  }

  public async merge({ logDir, dataDir }: T.MergeInput) {
    this.logger.infoBlank();
    this.logger.infoStarting();
    this.logger.infoBlank();
  }

  private toMovie(imdbId: string, data: ReadResponseData): T.ToMovieResponse {
    const posterFileName = data.posterUrl === null ? null : `poster${path.parse(path.basename(data.posterUrl)).ext}`;

    const output: T.ToMovieResponse = {
      index: {
        imdbId,
        title: data.title,
        releaseDate: data.releaseDate,
        releaseYear: data.releaseYear,
        posterFileName,
        rated: data.rated,
        genres: data.genres,
        directors: data.directors,
        writers: data.writers,
        actors: data.actors,
        runTime: data.runTimeMins,
        plot: data.plot,
        subtitleIds: [],
      },
      subtitles: [],
    };

    const subtitlesRaw = data.subtitles ?? [];
    for (let i = 0; i < subtitlesRaw.length; i++) {
      const { subtitleFileText, ...subtitleRaw } = subtitlesRaw[i];
      const ext = path.parse(path.basename(subtitleRaw.subtitleFileName)).ext;
      if (ext === '.srt') {
        const subTextValue = parseSrt3(subtitleFileText);
        const subTextId = this.generateHashFromText(subTextValue);
        const subTextFileName = `subtext.txt`;
        output.index.subtitleIds.push(subTextId);
        output.subtitles.push({ subTextId, ...subtitleRaw, subTextFileName, subTextValue });
      }
    }

    return output;
  }

  private generateHashFromText(fileContent: string): string {
    const hash = murmurhash.v3(fileContent);
    return hash.toString(16);
    // const hash = createHash('sha256');
    // hash.update(fileContent);
    // return hash.digest('hex');
  }
}
