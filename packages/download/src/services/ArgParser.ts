import { isNil } from 'lodash';
import type { Logger } from './Logger';

export class ArgParser {
  public constructor(private readonly logger: Logger) {}

  public parse(dataDir?: string, posterDir?: string) {
    const sanitisedFiles = this.sanitiseFiles(dataDir, posterDir);
    return {
      continue: sanitisedFiles.continue,
      dataDir: sanitisedFiles.dataDir,
      posterDir: sanitisedFiles.posterDir,
    };
  }

  private sanitiseFiles(dataDir?: string, posterDir?: string) {
    const dataDirHasValue = !isNil(dataDir);
    const posterDirHasValue = !isNil(posterDir);

    if (!dataDirHasValue && !dataDirHasValue) {
      this.logger.errorInvalidDataDirAndPosterDirArgsOutput();
      return { continue: false, dataDir: '', posterDir: '' };
    }

    if (!dataDirHasValue) {
      this.logger.errorInvalidDataDirArgsOutput();
      return { continue: false, dataDir: '', posterDir: '' };
    }

    if (!posterDirHasValue) {
      this.logger.errorInvalidPosterDirArgsOutput();
      return { continue: false, dataDir: '', posterDir: '' };
    }

    return { continue: true, dataDir, posterDir };
  }
}
