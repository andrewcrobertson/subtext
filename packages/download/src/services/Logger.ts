import { blue, cyan, green, magenta, red, yellow } from 'colorette';
import path from 'path';
import { ensureForwardSlash } from '../utils/ensureForwardSlash';

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

  public infoTitle(title: string) {
    this.logInfo(magenta(`=== ${title} ===`));
  }

  public infoProcessing(gitHubIssueNumber: number, imdbId: string) {
    this.logInfo(`GitHub issue ${green(gitHubIssueNumber)}, IMDB id ${green(imdbId)}`);
  }

  public infoMovieMetadataFound() {
    this.logInfo(`Metadata found`);
  }

  public infoMovieMetadataNotFound() {
    this.logWarn(`Metadata not found`);
  }

  public infoMovieSubtitlesFound() {
    this.logInfo(`Subtitles found`);
  }

  public infoMovieSubtitlesNotFound() {
    this.logWarn(`Subtitles not found`);
  }

  public infoSavedPosterFile(posterFile: string) {
    this.logInfo(`Saved poster file ${this.formatPath(posterFile)}`);
  }

  public infoSavedDataFile(dataFile: string) {
    this.logInfo(`Saved data file ${this.formatPath(dataFile)}`);
  }

  public errorMessage(message: string) {
    this.logError(message);
  }

  public errorInvalidDataDirAndPosterDirArgsOutput() {
    this.logError(`Please include ${green('data-dir')} and ${green('poster-dir')} args`);
  }

  public errorInvalidDataDirArgsOutput() {
    this.logError(`Please include a ${green('data-dir')} arg`);
  }

  public errorInvalidPosterDirArgsOutput() {
    this.logError(`Please include a ${green('poster-dir')} arg`);
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
