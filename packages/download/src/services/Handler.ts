import { createHash } from 'crypto';
import fs from 'fs';
import { isError, join, map, toPairs } from 'lodash';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { Downloader, DownloadResponseData } from '../../types/Downloader';
import { ToMovieResponse } from '../../types/Handler';
import { GithubApi } from './GithubApi';
import type { Logger } from './Logger';

export class Handler {
  public constructor(
    private readonly gitHubApi: GithubApi,
    private readonly downloader: Downloader,
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
    this.logger.infoBlank();
    for (let i = 0; i < openIssues.length; i++) {
      const issue = openIssues[i];
      await this.process(metaDir, subtitleDir, posterDir, issue.gitHubIssueNumber, issue.imdbId);
      this.logger.infoBlank();
    }
  }

  private async process(metaDir: string, subtitleDir: string, posterDir: string, gitHubIssueNumber: number, imdbId: string) {
    const gitHubComments: string[] = [];
    const metaFile = path.resolve(metaDir, `${imdbId}.json`);
    const gitHubIssueUrl = this.gitHubApi.getIssueUrl(gitHubIssueNumber);

    if (fs.existsSync(metaFile)) {
      const data = JSON.parse(fs.readFileSync(metaFile, 'utf-8'));
      const title = data.title;

      this.logger.infoTitle(title, imdbId);
      this.logger.infoReadGithubIssue(gitHubIssueUrl);
      gitHubComments.push(`:clapper: **${title}**`);

      this.logger.infoMovieAlreadyDownloaded();
      gitHubComments.push(`- Already downloaded`);

      await this.gitHubApi.addComment(gitHubIssueNumber, join(gitHubComments, '\n'));
      await this.gitHubApi.close(gitHubIssueNumber);
      this.logger.infoClosedGitHubIssues();

      return;
    }

    const downloadRes = await this.downloader.download(imdbId);

    const errorText = map(downloadRes.errors, (error) => (isError(error) ? error.message : (<any>error).toString()));
    const title = downloadRes.data?.title ?? 'Unknown Title';

    this.logger.infoTitle(title, imdbId);
    this.logger.infoReadGithubIssue(gitHubIssueUrl);
    gitHubComments.push(`:clapper: **${title}**`);

    for (let i = 0; i < errorText.length; i++) {
      this.logger.errorMessage(errorText[i]);
    }

    if (downloadRes.success) {
      this.logger.infoMovieMetadataFound();
      gitHubComments.push(`- Metadata found`);
    } else {
      this.logger.infoMovieMetadataNotFound();
      gitHubComments.push(`- Metadata not found`);
    }

    if (downloadRes.success && downloadRes.data.subtitles.length > 0) {
      this.logger.infoMovieSubtitlesFound();
      gitHubComments.push(`- Subtitles found`);
    } else {
      this.logger.infoMovieSubtitlesNotFound();
      gitHubComments.push(`- Subtitles not found`);
    }

    if (errorText.length > 0) {
      gitHubComments.push(``);
      gitHubComments.push(`:no_entry: **Errors**`);
      gitHubComments.push('- ' + join(errorText, '\n- '));
      gitHubComments.push(``);
    }

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

    await this.gitHubApi.addComment(gitHubIssueNumber, join(gitHubComments, '\n'));
    await this.gitHubApi.close(gitHubIssueNumber);
    this.logger.infoClosedGitHubIssues();
  }

  private toMovie(imdbId: string, data: DownloadResponseData): ToMovieResponse {
    const output: ToMovieResponse = {
      imdbId,
      title: data.title,
      releaseDate: data.releaseDate,
      releaseYear: data.releaseYear,
      posterFileName: data.posterUrl === null ? null : `${imdbId}${path.parse(path.basename(data.posterUrl)).ext}`,
      rated: data.rated,
      genres: data.genres,
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
      const shaFileName = `${sha}${ext}`;
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