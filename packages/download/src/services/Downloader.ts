import { createHash } from 'crypto';
import fs from 'fs';
import { concat, filter, flattenDeep, get, isError, join, map, toPairs } from 'lodash';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { OmdbSearchResponse, SubdlSearchResponse, ToMovieResponse, ToMovieResponseSubtitle } from '../../types/Downloader';
import { GithubApi } from './GithubApi';
import type { Logger } from './Logger';
import type { OmdbApi } from './OmdbApi';
import { SubdlApi } from './SubdlApi';

export class Downloader {
  public constructor(
    private readonly gitHubApi: GithubApi,
    private readonly omdbApi: OmdbApi,
    private readonly subdlApi: SubdlApi,
    private readonly logger: Logger
  ) {}

  public async run(metaDir: string, subtitleDir: string, posterDir: string) {
    fs.mkdirSync(metaDir, { recursive: true });
    fs.mkdirSync(subtitleDir, { recursive: true });
    fs.mkdirSync(posterDir, { recursive: true });

    this.logger.infoBlank();
    this.logger.infoStarting();
    const openIssues = await this.gitHubApi.getOpenIssues('add');

    this.logger.infoOpenGitHubIssuesFound(openIssues.length);
    for (let i = 0; i < openIssues.length; i++) {
      const issue = openIssues[i];
      await this.process(metaDir, subtitleDir, posterDir, issue.gitHubIssueNumber, issue.imdbId);
    }

    this.logger.infoBlank();
  }

  private async process(metaDir: string, subtitleDir: string, posterDir: string, gitHubIssueNumber: number, imdbId: string) {
    const gitHubComments: string[] = [];

    const [omdbSearchRes, subdlSearchRes] = await Promise.all([this.omdbSearch(imdbId), this.subdlSearch(imdbId)]);

    const errors = concat(omdbSearchRes.errors, subdlSearchRes.errors);
    const errorText = map(errors, (error) => (isError(error) ? error.message : (<any>error).toString()));
    const title = omdbSearchRes.data?.title ?? subdlSearchRes.data?.title ?? 'Unknown Title';

    this.logger.infoTitle(title);
    this.logger.infoProcessing(gitHubIssueNumber, imdbId);
    gitHubComments.push(`**${title}**`);

    if (omdbSearchRes.success) {
      this.logger.infoMovieMetadataFound();
      gitHubComments.push(`:heavy_check_mark: Metadata found`);
    } else {
      this.logger.infoMovieMetadataNotFound();
      gitHubComments.push(`:heavy_multiplication_x: Metadata not found`);
    }

    if (subdlSearchRes.success && subdlSearchRes.data.subtitles.length > 0) {
      this.logger.infoMovieSubtitlesFound();
      gitHubComments.push(`:heavy_check_mark: Subtitles found`);
    } else {
      this.logger.infoMovieSubtitlesNotFound();
      gitHubComments.push(`:heavy_multiplication_x: Subtitles not found`);
    }

    if (errorText.length > 0) {
      gitHubComments.push(``);
      gitHubComments.push(`**Errors**`);
      gitHubComments.push(join(errorText, '\n'));

      for (let i = 0; i < errorText.length; i++) {
        this.logger.errorMessage(errorText[i]);
      }
    }

    const posterUrl = omdbSearchRes.data?.posterUrl ?? null;
    if (posterUrl !== null) {
      const ext = path.parse(path.basename(posterUrl)).ext;
      const posterFile = path.resolve(posterDir, `${imdbId}${ext}`);
      const response = await fetch(posterUrl);
      const fileStream = fs.createWriteStream(posterFile);
      await promisify(pipeline)(response.body as unknown as NodeJS.ReadableStream, fileStream);
      this.logger.infoSavedPosterFile(posterFile);
    }

    const { files, ...meta } = this.toMovie(imdbId, omdbSearchRes, subdlSearchRes);

    const metaFile = path.resolve(metaDir, `${imdbId}.json`);
    fs.writeFileSync(metaFile, JSON.stringify(meta, null, 2));
    this.logger.infoSavedMetaFile(metaFile);

    const filePairs = toPairs(files);
    for (let i = 0; i < filePairs.length; i++) {
      const [subtitleFileName, subtitleText] = filePairs[i];
      const subtitleFile = path.resolve(subtitleDir, subtitleFileName);
      fs.writeFileSync(subtitleFile, subtitleText);
      this.logger.infoSavedSubtitleFile(subtitleFile);
    }

    await this.gitHubApi.addComment(gitHubIssueNumber, join(gitHubComments, '\n'));
    await this.gitHubApi.close(gitHubIssueNumber);
  }

  private toMovie(imdbId: string, omdbSearchRes: OmdbSearchResponse, subdlSearchRes: SubdlSearchResponse): ToMovieResponse {
    const posterUrl = omdbSearchRes.data?.posterUrl ?? null;
    const posterFileName = posterUrl === null ? null : `${imdbId}${path.parse(path.basename(posterUrl)).ext}`;

    const subtitlesRaw = subdlSearchRes.data?.subtitles ?? [];
    const subtitles: ToMovieResponseSubtitle[] = [];
    const files: Record<string, string> = {};
    for (let i = 0; i < subtitlesRaw.length; i++) {
      const { sha, subtitleFileText, ...subtitleRaw } = subtitlesRaw[i];
      const ext = path.parse(path.basename(subtitleRaw.subtitleFileName)).ext;
      const shaFileName = `${sha}${ext}`;
      files[shaFileName] = subtitleFileText;
      subtitles.push({ ...subtitleRaw, shaFileName });
    }

    return {
      imdbId,
      title: omdbSearchRes.data?.title ?? subdlSearchRes.data?.title ?? null,
      releaseDate: omdbSearchRes.data?.releaseDate ?? subdlSearchRes.data?.releaseDate ?? null,
      releaseYear: omdbSearchRes.data?.releaseYear ?? subdlSearchRes.data?.releaseYear ?? null,
      posterFileName,
      rated: omdbSearchRes.data?.rated ?? null,
      genres: omdbSearchRes.data?.genres ?? [],
      actors: omdbSearchRes.data?.actors ?? [],
      runTime: omdbSearchRes.data?.runTimeMins ?? null,
      plot: omdbSearchRes.data?.plot ?? null,
      subtitles,
      files,
    };
  }

  private async omdbSearch(imdbId: string): Promise<OmdbSearchResponse> {
    try {
      const data = await this.omdbApi.search(imdbId);
      return { success: true, data, errors: [] };
    } catch (cause) {
      const causeMessage = get(cause, ['message'], null);
      const message = 'Omdb Error: api fetch unexpected error ' + (causeMessage === null ? '' : `: '${causeMessage}'`);
      return { success: false, data: null, errors: [new Error(message, { cause })] };
    }
  }

  private async subdlSearch(imdbId: string): Promise<SubdlSearchResponse> {
    try {
      const { subtitles: subtitlesAll, ...dataRaw } = await this.subdlApi.search(imdbId);
      const errorsRaw = map(subtitlesAll, (s) => s.errors);
      const errors = flattenDeep(errorsRaw);
      const subtitlesRaw = filter(subtitlesAll, (s) => s.success);
      const subtitles = map(subtitlesRaw, (s) => ({ ...s.data, sha: this.generateHashFromText(s.data.subtitleFileText) }));
      const data = { ...dataRaw, subtitles };
      return { success: true, data, errors };
    } catch (cause) {
      const causeMessage = get(cause, ['message'], null);
      const message = 'Subdl Error: api fetch unexpected error ' + (causeMessage === null ? '' : `: '${causeMessage}'`);
      return { success: false, data: null, errors: [new Error(message, { cause })] };
    }
  }

  private generateHashFromText(fileContent: string, algorithm: 'sha256' | 'sha1' | 'sha512' = 'sha256'): string {
    const hash = createHash(algorithm);
    hash.update(fileContent);
    return hash.digest('hex');
  }
}
