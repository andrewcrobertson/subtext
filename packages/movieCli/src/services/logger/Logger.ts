import { ensureForwardSlash } from '$utils/ensureForwardSlash';
import { blue, cyan, green, magenta, red, yellow } from 'colorette';
import { join, map } from 'lodash';
import path from 'path';

const quote = (value: string) => `'${value}'`;

export class Logger {
  public constructor(
    private readonly logPrefix: string,
    private readonly verbose: boolean
  ) {}

  public infoBlank() {
    this.logInfo('');
  }

  public infoStarting() {
    this.logInfo(magenta('=== Starting ==='));
  }

  public infoOpenGitHubIssuesFound(openIssueCount: number) {
    const issueP11n = openIssueCount === 1 ? 'issue' : 'issues';
    this.logInfo(`${green(openIssueCount)} open ${issueP11n} found`);
  }

  public infoClosedGitHubIssues() {
    this.logInfo(`Closed GitHub issue`);
  }

  public infoTitle(title: string, imdbId: string) {
    this.logInfo(magenta(`=== ${title} (${imdbId}) ===`));
  }

  public infoReadGithubIssue(gitHubIssueUrl: string) {
    this.logInfo(`Read GitHub issue '${green(gitHubIssueUrl)}'`);
  }

  public infoMovieMetadataFound() {
    this.logInfo(`Metadata found`);
  }

  public infoMovieAlreadyDownloaded() {
    this.logInfo(`Already downloaded`);
  }

  public infoMovieMetadataNotFound() {
    this.logWarn(`Metadata not found`);
  }

  public infoMovieSubtitlesFound(subtitleCount: number) {
    const subtitleP11n = subtitleCount === 1 ? 'subtitle' : 'subtitles';
    this.logInfo(`${green(subtitleCount)} ${subtitleP11n} found`);
  }

  public infoMovieSubtitlesNotFound() {
    this.logWarn(`Subtitles not found`);
  }

  public infoSavedPosterFile(posterFile: string) {
    this.logInfo(`Saved poster file ${this.formatPath(posterFile)}`);
  }

  public infoSavedMetaFile(metaFile: string) {
    this.logInfo(`Saved meta file ${this.formatPath(metaFile)}`);
  }

  public infoSavedSubtitleFile(subtitleFile: string) {
    this.logInfo(`Saved subtitle file ${this.formatPath(subtitleFile)}`);
  }

  public errorMessage(message: string) {
    this.logError(message);
  }

  public errorInvalidmetaDirAndPosterDirArgsOutput(missingArgs: string[]) {
    const argMissingP11n = missingArgs.length === 1 ? 'arg is missing' : 'args are missing';
    const args = map(missingArgs, (a) => green(a));
    this.logError(`The following required ${argMissingP11n}: ${join(args, ', ')}`);
  }

  public infoFinished() {
    this.logInfo('Finished');
  }

  private formatPath(fileOrDir: string) {
    return cyan(quote(ensureForwardSlash(path.relative(process.cwd(), fileOrDir))));
  }

  private logInfo(message: string) {
    console.log(`${this.logPrefix} ${blue('info')} ${message}`);
  }

  private logWarn(message: string) {
    console.log(`${this.logPrefix} ${yellow('warn')} ${message}`);
  }

  private logError(message: string) {
    console.log(`${this.logPrefix} ${red('error')} ${message}`);
  }
}
