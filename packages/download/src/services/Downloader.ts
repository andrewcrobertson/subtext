import fs from 'fs';
import { join } from 'lodash';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { GithubApi } from './GithubApi';
import type { Logger } from './Logger';
import type { OmdbManager } from './OmdbManager';
import type { SubdlManager } from './SubdlManager';

export class Downloader {
  public constructor(
    private readonly gitHubApi: GithubApi,
    private readonly omdbManager: OmdbManager,
    private readonly subdlManager: SubdlManager,
    private readonly logger: Logger
  ) {}

  public async run(outputDir: string) {
    this.logger.infoStarting();
    const openIssues = await this.gitHubApi.getOpenIssues('add');

    if (openIssues.length === 0) {
      this.logger.infoOpenGitHubIssuesNotFound();
    } else {
      this.logger.infoOpenGitHubIssuesFound(openIssues.length);
      for (let i = 0; i < openIssues.length; i++) {
        const issue = openIssues[i];
        await this.process(outputDir, issue.gitHubIssueNumber, issue.imdbId);
      }
    }

    this.logger.infoBlank();
  }

  private async process(outputDir: string, gitHubIssueNumber: number, imdbId: string) {
    this.logger.infoProcessingOpenGitHubIssue(gitHubIssueNumber, imdbId);

    const gitHubComments: string[] = [];

    if (await this.exists(imdbId)) {
      await this.gitHubApi.tagAsDuplicate(gitHubIssueNumber);
    } else {
      const omdbInfo = await this.omdbManager.getInfo(imdbId);
      const subdlInfo = await this.subdlManager.getInfo(imdbId);

      const title = omdbInfo.title ?? subdlInfo.title ?? 'Unknown Title';
      gitHubComments.push(`**${title}**`);

      if (omdbInfo) {
        this.logger.infoMovieMetadataFound(imdbId, title);
        gitHubComments.push(`:heavy_check_mark: Metadata found`);
      } else {
        this.logger.infoMovieMetadataNotFound(imdbId);
        gitHubComments.push(`:heavy_multiplication_x: Metadata not found`);
      }

      if (subdlInfo.options.length > 0) {
        this.logger.infoMovieSubtitlesFound(imdbId);
        gitHubComments.push(`:heavy_check_mark: Subtitles found`);
      } else {
        this.logger.infoMovieSubtitlesNotFound(imdbId);
        gitHubComments.push(`:heavy_multiplication_x: Subtitles not found`);
      }

      const ext = path.parse(path.basename(omdbInfo.poster)).ext;
      const response = await fetch(omdbInfo.poster);
      const fileStream = fs.createWriteStream(path.resolve(outputDir, 'posters', `${imdbId}${ext}`));
      await promisify(pipeline)(response.body as unknown as NodeJS.ReadableStream, fileStream);

      const movie = { ...subdlInfo, ...omdbInfo, poster: `posters/${imdbId}${ext}` };
      fs.writeFileSync(path.resolve(outputDir, 'data', `${imdbId}.json`), JSON.stringify(movie, null, 2));
    }

    await this.gitHubApi.addComment(gitHubIssueNumber, join(gitHubComments, '\n'));
    await this.gitHubApi.close(gitHubIssueNumber);
  }

  private async exists(imdbId: string) {
    return false;
  }
}
