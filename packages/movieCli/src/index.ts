import { getMovieHandler } from '$composition/services';
import * as common from '$constants/common';
import * as loadMultiple from '$constants/loadMultiple';
import * as loadSingle from '$constants/loadSingle';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

yargs(hideBin(process.argv))
  .usage('Usage: movie-cli <command> [options]')
  .command(
    loadSingle.command,
    loadSingle.description,
    (yargs) =>
      yargs
        .option(loadSingle.optionImdbIdName, {
          alias: loadSingle.optionImdbIdAlias,
          description: loadSingle.optionImdbIdDescription,
          type: 'string',
          demandOption: true,
        })
        .option(loadSingle.optionLogDirName, {
          alias: loadSingle.optionLogDirAlias,
          description: loadSingle.optionLogDirDescription,
          type: 'string',
          demandOption: true,
        })
        .option(loadSingle.optionForceName, {
          alias: loadSingle.optionForceAlias,
          description: loadSingle.optionForceDescription,
          type: 'boolean',
          default: false,
          demandOption: true,
        })
        .option(common.optionVerboseName, { alias: common.optionVerboseAlias, description: common.optionVerboseDescription, type: 'boolean', default: false }),
    (args) => getMovieHandler(args.verbose).loadSingle(args)
  )
  .command(
    loadMultiple.command,
    loadMultiple.description,
    (yargs) =>
      yargs
        .option(loadMultiple.optionImdbIdName, {
          alias: loadMultiple.optionImdbIdAlias,
          description: loadMultiple.optionImdbIdDescription,
          type: 'string',
          array: true,
          demandOption: true,
        })
        .option(loadMultiple.optionLogDirName, {
          alias: loadMultiple.optionLogDirAlias,
          description: loadMultiple.optionLogDirDescription,
          type: 'string',
          demandOption: true,
        })
        .option(loadMultiple.optionForceName, {
          alias: loadMultiple.optionForceAlias,
          description: loadMultiple.optionForceDescription,
          type: 'boolean',
          default: false,
          demandOption: true,
        })
        .option(common.optionVerboseName, { alias: common.optionVerboseAlias, description: common.optionVerboseDescription, type: 'boolean', default: false }),
    (args) => getMovieHandler(args.verbose).loadMultiple(args)
  )
  .parse();
