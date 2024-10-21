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

  public infoOpenGitHubIssuesNotFound() {
    this.logInfo(`No open issues found`);
  }

  public infoOpenGitHubIssuesFound(openIssueCount: number) {
    this.logInfo(`${green(openIssueCount)} open issues found`);
  }

  public infoProcessingOpenGitHubIssue(gitHubIssueNumber: number, imdbId: string) {
    this.logInfo(`Processing GitHub Issue ${green(gitHubIssueNumber)} / IMDB Id ${green(imdbId)} `);
  }

  public infoMovieMetadataFound(imdbId: string, title: string) {
    this.logInfo(`Found movie metadata for IMDB Id ${green(imdbId)}: ${green(title)}`);
  }

  public infoMovieMetadataNotFound(imdbId: string) {
    this.logWarn(`Could not find movie metadata with IMDB Id ${green(imdbId)}`);
  }

  public infoMovieSubtitlesFound(imdbId: string) {
    this.logInfo(`Found movie subtitles for IMDB Id ${green(imdbId)}`);
  }

  public infoMovieSubtitlesNotFound(imdbId: string) {
    this.logWarn(`Could not find movie subtitles for IMDB Id ${green(imdbId)}`);
  }

  // public errorInvalidFileArgsInputFileNotExist(inputFile: string) {
  //   this.logError(`Could not find input file ${this.formatPath(inputFile)}`);
  // }

  public errorInvalidFileArgsOutput() {
    this.logError(`Please pass in an output`);
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
