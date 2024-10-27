import { downloadHandler } from '$composition/services';
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
        .option(strings.downloadImdbIdName, {
          alias: strings.downloadImdbIdAlias,
          describe: strings.downloadImdbIdDescribe,
          type: 'string',
          demandOption: true,
        })
        .option(strings.downloadDirName, {
          alias: strings.downloadDirAlias,
          describe: strings.downloadDirDescribe,
          type: 'string',
          demandOption: true,
        })
        .option(strings.downloadForceName, {
          alias: strings.downloadForceAlias,
          describe: strings.downloadForceDescribe,
          type: 'boolean',
          default: false,
          demandOption: true,
        })
        .option(strings.verboseName, { alias: strings.verboseAlias, describe: strings.verboseDescribe, type: 'boolean', default: false }),
    (args) => downloadHandler(args.verbose).run(args)
  )
  .parse();
