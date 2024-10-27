import { handler } from '$composition/services';
import * as strings from '$constants/strings';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

yargs(hideBin(process.argv))
  .usage('Usage: movie-cli <command> [options]')
  .command(
    strings.download,
    strings.downloadDescribe,
    (yargs) =>
      yargs
        .option(strings.downloadMetaDirName, {
          alias: strings.downloadMetaDirAlias,
          describe: strings.downloadMetaDirDescribe,
          type: 'string',
          demandOption: true,
        })
        .option(strings.downloadSubtitleDirName, {
          alias: strings.downloadSubtitleDirAlias,
          describe: strings.downloadSubtitleDirDescribe,
          type: 'string',
          demandOption: true,
        })
        .option(strings.downloadPosterDirName, {
          alias: strings.downloadPosterDirAlias,
          describe: strings.downloadPosterDirDescribe,
          type: 'string',
          demandOption: true,
        })
        .option(strings.verboseName, { alias: strings.verboseAlias, describe: strings.verboseDescribe, type: 'boolean', default: false }),
    (args) => handler(args.verbose).run(args)
  )
  .parse();
