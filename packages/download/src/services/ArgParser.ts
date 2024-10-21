import { isNil } from 'lodash';
import type { Logger } from './Logger';

export class ArgParser {
  public constructor(private readonly logger: Logger) {}

  public parse(outputDir?: string) {
    const sanitisedFiles = this.sanitiseFiles(outputDir);
    return {
      continue: sanitisedFiles.continue,
      outputDir: sanitisedFiles.outputDir,
    };
  }

  private sanitiseFiles(outputDir?: string) {
    const outputDirHasValue = !isNil(outputDir);

    if (!outputDirHasValue) {
      this.logger.errorInvalidFileArgsOutput();
      return { continue: false, outputDir: '' };
    }

    return { continue: true, outputDir };
  }
}
