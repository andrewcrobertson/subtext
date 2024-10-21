import type { ArgParser } from './ArgParser';
import { Downloader } from './Downloader';
import type { Logger } from './Logger';

export class Handler {
  public constructor(
    private readonly argParser: ArgParser,
    private readonly downloader: Downloader,
    private readonly logger: Logger
  ) {}

  public async run(outputDir?: string) {
    this.logger.infoBlank();
    const args = this.argParser.parse(outputDir);
    if (args.continue) {
      await this.downloader.run(args.outputDir);
    } else {
      this.logger.infoBlank();
    }
  }
}
