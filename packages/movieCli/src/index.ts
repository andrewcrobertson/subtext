import { getMovieHandler } from '$composition/services';
import * as strings from '$constants/strings';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

yargs(hideBin(process.argv))
  .usage('Usage: movie-cli <command> [options]')
  .command(
    strings.getSingle,
    strings.getSingleDescribe,
    (yargs) =>
      yargs
        .option(strings.getSingleImdbIdName, {
          alias: strings.getSingleImdbIdAlias,
          describe: strings.getSingleImdbIdDescribe,
          type: 'string',
          demandOption: true,
        })
        .option(strings.getSingleDirName, {
          alias: strings.getSingleDirAlias,
          describe: strings.getSingleDirDescribe,
          type: 'string',
          demandOption: true,
        })
        .option(strings.getSingleForceName, {
          alias: strings.getSingleForceAlias,
          describe: strings.getSingleForceDescribe,
          type: 'boolean',
          default: false,
          demandOption: true,
        })
        .option(strings.verboseName, { alias: strings.verboseAlias, describe: strings.verboseDescribe, type: 'boolean', default: false }),
    (args) => getMovieHandler(args.verbose).getSingle(args)
  )
  .command(
    strings.getMultiple,
    strings.getMultipleDescribe,
    (yargs) =>
      yargs
        .option(strings.getMultipleImdbIdName, {
          alias: strings.getMultipleImdbIdAlias,
          describe: strings.getMultipleImdbIdDescribe,
          type: 'string',
          array: true,
          demandOption: true,
        })
        .option(strings.getMultipleDirName, {
          alias: strings.getMultipleDirAlias,
          describe: strings.getMultipleDirDescribe,
          type: 'string',
          demandOption: true,
        })
        .option(strings.getMultipleForceName, {
          alias: strings.getMultipleForceAlias,
          describe: strings.getMultipleForceDescribe,
          type: 'boolean',
          default: false,
          demandOption: true,
        })
        .option(strings.verboseName, { alias: strings.verboseAlias, describe: strings.verboseDescribe, type: 'boolean', default: false }),
    (args) => getMovieHandler(args.verbose).getMultiple(args)
  )
  .parse();
