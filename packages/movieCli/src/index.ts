import { getMovieHandler } from '$composition/services';
import * as common from '$constants/common';
import * as getMultiple from '$constants/getMultiple';
import * as getSingle from '$constants/getSingle';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

yargs(hideBin(process.argv))
  .usage('Usage: movie-cli <command> [options]')
  .command(
    getSingle.command,
    getSingle.description,
    (yargs) =>
      yargs
        .option(getSingle.optionImdbIdName, {
          alias: getSingle.optionImdbIdAlias,
          describe: getSingle.optionImdbIdDescribe,
          type: 'string',
          demandOption: true,
        })
        .option(getSingle.optionDirName, {
          alias: getSingle.optionAlias,
          describe: getSingle.optionDirDescribe,
          type: 'string',
          demandOption: true,
        })
        .option(getSingle.optionForceName, {
          alias: getSingle.optionForceAlias,
          describe: getSingle.optionForceDescribe,
          type: 'boolean',
          default: false,
          demandOption: true,
        })
        .option(common.optionVerboseName, { alias: common.optionVerboseAlias, describe: common.optionVerboseDescribe, type: 'boolean', default: false }),
    (args) => getMovieHandler(args.verbose).getSingle(args)
  )
  .command(
    getMultiple.command,
    getMultiple.description,
    (yargs) =>
      yargs
        .option(getMultiple.optionImdbIdName, {
          alias: getMultiple.optionImdbIdAlias,
          describe: getMultiple.optionImdbIdDescribe,
          type: 'string',
          array: true,
          demandOption: true,
        })
        .option(getMultiple.optionDirName, {
          alias: getMultiple.optionDirAlias,
          describe: getMultiple.optionDescribe,
          type: 'string',
          demandOption: true,
        })
        .option(getMultiple.optionForceName, {
          alias: getMultiple.optionForceAlias,
          describe: getMultiple.optionForceDescribe,
          type: 'boolean',
          default: false,
          demandOption: true,
        })
        .option(common.optionVerboseName, { alias: common.optionVerboseAlias, describe: common.optionVerboseDescribe, type: 'boolean', default: false }),
    (args) => getMovieHandler(args.verbose).getMultiple(args)
  )
  .parse();
