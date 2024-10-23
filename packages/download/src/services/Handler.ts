import type { ArgParser } from './ArgParser';
import { Downloader } from './Downloader';
import type { Logger } from './Logger';

export class Handler {
  public constructor(
    private readonly argParser: ArgParser,
    private readonly downloader: Downloader,
    private readonly logger: Logger
  ) {}

  public async run(dataDir?: string, posterDir?: string) {
    this.logger.infoBlank();
    const args = this.argParser.parse(dataDir, posterDir);
    if (args.continue) {
      await this.downloader.run(args.dataDir, args.posterDir);
    } else {
      this.logger.infoBlank();
    }
  }
}
