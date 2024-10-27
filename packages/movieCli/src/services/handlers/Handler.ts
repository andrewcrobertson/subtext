import type { Logger } from '$services/logger/Logger';
import type { MovieReader, ReadResponseData } from '$services/movieReader/MovieReader.types';
import { parseSrt3 } from '$utils/parseSrt';
import fs from 'fs';
import * as glob from 'glob';
import { concat, isError, map } from 'lodash';
import murmurhash from 'murmurhash';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import type * as T from './Handler.types';

export class Handler {
  public constructor(
    private readonly downloader: MovieReader,
    private readonly logger: Logger
  ) {}

  public async load({ imdbId, logDir, force }: T.LoadInput) {
    const rootDir = path.resolve(logDir, imdbId);
    const subtitleDir = path.resolve(rootDir, 'subtitles');

    this.logger.infoBlank();
    this.logger.infoStarting();

    const metaFile = path.resolve(rootDir, 'index.json');
    if (!force && fs.existsSync(metaFile)) {
      const data = JSON.parse(fs.readFileSync(metaFile, 'utf-8'));
      this.logger.infoTitle(data.title, imdbId);
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
    const { subtitles, ...meta } = this.toMovie(imdbId, downloadRes.data!);

    const posterUrl = downloadRes.data?.posterUrl ?? null;
    if (posterUrl !== null) {
      const posterFile = path.resolve(rootDir, meta.posterFileName!);
      this.ensureDir(posterFile);
      const response = await fetch(posterUrl);
      const fileStream = fs.createWriteStream(posterFile);
      await promisify(pipeline)(response.body as unknown as NodeJS.ReadableStream, fileStream);
      this.logger.infoSavedPosterFile(posterFile);
    }

    this.ensureDir(metaFile);
    fs.writeFileSync(metaFile, JSON.stringify(meta, null, 2));
    this.logger.infoSavedMetaFile(metaFile);

    for (let i = 0; i < subtitles.length; i++) {
      const { subTextValue, ...meta } = subtitles[i];

      const metaFile = path.resolve(subtitleDir, meta.subTextId, 'index.json');
      this.ensureDir(metaFile);
      fs.writeFileSync(metaFile, JSON.stringify(meta, null, 2));
      this.logger.infoSavedMetaFile(metaFile);

      const subtitleFile = path.resolve(subtitleDir, meta.subTextId, meta.subTextFileName);
      fs.writeFileSync(subtitleFile, subTextValue);
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

  private ensureDir(filePath: string) {
    fs.mkdirSync(path.resolve(filePath, '..'), { recursive: true });
  }

  private toMovie(imdbId: string, data: ReadResponseData): T.ToMovieResponse {
    const output: T.ToMovieResponse = {
      imdbId,
      title: data.title,
      releaseDate: data.releaseDate,
      releaseYear: data.releaseYear,
      posterFileName: data.posterUrl === null ? null : `poster${path.parse(path.basename(data.posterUrl)).ext}`,
      rated: data.rated,
      genres: data.genres,
      directors: data.directors,
      writers: data.writers,
      actors: data.actors,
      runTime: data.runTimeMins,
      plot: data.plot,
      subtitleIds: [],
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
        output.subtitleIds.push(subTextId);
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
