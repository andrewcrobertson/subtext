import type { Downloader, DownloadResponseData } from '$services/downloader/Downloader.types';
import type { Logger } from '$services/logger/Logger';
import { createHash } from 'crypto';
import fs from 'fs';
import { isError, map, toPairs } from 'lodash';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import type * as T from './DownloadHandler.types';

export class DownloadHandler {
  public constructor(
    private readonly downloader: Downloader,
    private readonly logger: Logger
  ) {}

  public async run({ imdbId, targetDir, force }: T.RunInput) {
    const metaDir = path.resolve(targetDir, 'meta');
    const posterDir = path.resolve(targetDir, 'posters');
    const subtitleDir = path.resolve(targetDir, 'subtitles');

    fs.mkdirSync(metaDir, { recursive: true });
    fs.mkdirSync(posterDir, { recursive: true });
    fs.mkdirSync(subtitleDir, { recursive: true });

    this.logger.infoBlank();
    this.logger.infoStarting();

    const metaFile = path.resolve(metaDir, `${imdbId}.json`);
    if (!force && fs.existsSync(metaFile)) {
      const data = JSON.parse(fs.readFileSync(metaFile, 'utf-8'));
      this.logger.infoTitle(data.title, imdbId);
      this.logger.infoMovieAlreadyDownloaded();
      return;
    }

    const downloadRes = await this.downloader.download(imdbId);
    const errorText = map(downloadRes.errors, (error) => (isError(error) ? error.message : (<any>error).toString()));
    const title = downloadRes.data?.title ?? 'Unknown Title';

    this.logger.infoTitle(title, imdbId);
    for (let i = 0; i < errorText.length; i++) {
      this.logger.errorMessage(errorText[i]);
    }

    const subtitleCount = downloadRes.data?.subtitles.length ?? 0;
    this.logger.infoMovieSubtitlesFound(subtitleCount);

    const posterUrl = downloadRes.data?.posterUrl ?? null;
    if (posterUrl !== null) {
      const ext = path.parse(path.basename(posterUrl)).ext;
      const posterFile = path.resolve(posterDir, `${imdbId}${ext}`);
      const response = await fetch(posterUrl);
      const fileStream = fs.createWriteStream(posterFile);
      await promisify(pipeline)(response.body as unknown as NodeJS.ReadableStream, fileStream);
      this.logger.infoSavedPosterFile(posterFile);
    }

    const { files, ...meta } = this.toMovie(imdbId, downloadRes.data!);

    fs.writeFileSync(metaFile, JSON.stringify(meta, null, 2));
    this.logger.infoSavedMetaFile(metaFile);

    const filePairs = toPairs(files);
    for (let i = 0; i < filePairs.length; i++) {
      const [subtitleFileName, subtitleText] = filePairs[i];
      const subtitleFile = path.resolve(subtitleDir, subtitleFileName);
      fs.writeFileSync(subtitleFile, subtitleText);
      this.logger.infoSavedSubtitleFile(subtitleFile);
    }

    this.logger.infoClosedGitHubIssues();
  }

  private toMovie(imdbId: string, data: DownloadResponseData): T.ToMovieResponse {
    const output: T.ToMovieResponse = {
      imdbId,
      title: data.title,
      releaseDate: data.releaseDate,
      releaseYear: data.releaseYear,
      posterFileName: data.posterUrl === null ? null : `${imdbId}${path.parse(path.basename(data.posterUrl)).ext}`,
      rated: data.rated,
      genres: data.genres,
      directors: data.directors,
      writers: data.writers,
      actors: data.actors,
      runTime: data.runTimeMins,
      plot: data.plot,
      subtitles: [],
      files: {},
    };

    const subtitlesRaw = data.subtitles ?? [];
    for (let i = 0; i < subtitlesRaw.length; i++) {
      const { subtitleFileText, ...subtitleRaw } = subtitlesRaw[i];
      const sha = this.generateHashFromText(subtitleFileText);
      const ext = path.parse(path.basename(subtitleRaw.subtitleFileName)).ext;
      const shaFileName = `${imdbId}.${sha}${ext}`;
      output.files[shaFileName] = subtitleFileText;
      output.subtitles.push({ ...subtitleRaw, shaFileName });
    }

    return output;
  }

  private generateHashFromText(fileContent: string): string {
    const hash = createHash('sha256');
    hash.update(fileContent);
    return hash.digest('hex');
  }
}
