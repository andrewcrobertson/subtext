import { getHandler } from '$composition/services';
import * as common from '$constants/common';
import * as flag from '$constants/flag';
import * as index from '$constants/index';
import * as load from '$constants/load';
import * as remove from '$constants/remove';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

yargs(hideBin(process.argv))
  .usage('Usage: movie-cli <command> [options]')
  .command(
    load.command,
    load.description,
    (yargs) =>
      yargs
        .option(load.optionUserIdName, {
          alias: load.optionUserIdAlias,
          description: load.optionUserIdDescription,
          type: 'string',
          demandOption: true,
        })
        .option(load.optionImdbIdName, {
          alias: load.optionImdbIdAlias,
          description: load.optionImdbIdDescription,
          type: 'string',
          demandOption: true,
        })
        .option(load.optionDataDirName, {
          alias: load.optionDataDirAlias,
          description: load.optionDataDirDescription,
          type: 'string',
          demandOption: true,
        })
        .option(load.optionForceName, {
          alias: load.optionForceAlias,
          description: load.optionForceDescription,
          type: 'boolean',
          default: false,
          demandOption: true,
        })
        .option(common.optionVerboseName, { alias: common.optionVerboseAlias, description: common.optionVerboseDescription, type: 'boolean', default: false }),
    (args) => getHandler(args.dir, args.verbose).load(args)
  )
  .command(
    remove.command,
    remove.description,
    (yargs) =>
      yargs
        .option(remove.optionUserIdName, {
          alias: remove.optionUserIdAlias,
          description: remove.optionUserIdDescription,
          type: 'string',
          demandOption: true,
        })
        .option(remove.optionImdbIdName, {
          alias: remove.optionImdbIdAlias,
          description: remove.optionImdbIdDescription,
          type: 'string',
          demandOption: true,
        })
        .option(remove.optionDataDirName, {
          alias: remove.optionDataDirAlias,
          description: remove.optionDataDirDescription,
          type: 'string',
          demandOption: true,
        })
        .option(common.optionVerboseName, { alias: common.optionVerboseAlias, description: common.optionVerboseDescription, type: 'boolean', default: false }),
    (args) => getHandler(args.dir, args.verbose).remove(args)
  )
  .command(
    flag.command,
    flag.description,
    (yargs) =>
      yargs
        .option(flag.optionUserIdName, {
          alias: flag.optionUserIdAlias,
          description: flag.optionUserIdDescription,
          type: 'string',
          demandOption: true,
        })
        .option(flag.optionImdbIdName, {
          alias: flag.optionImdbIdAlias,
          description: flag.optionImdbIdDescription,
          type: 'string',
          demandOption: true,
        })
        .option(flag.optionSubtitleIdName, {
          alias: flag.optionSubtitleIdAlias,
          description: flag.optionSubtitleIdDescription,
          type: 'string',
          demandOption: true,
        })
        .option(flag.optionReasonName, {
          alias: flag.optionReasonAlias,
          description: flag.optionReasonDescription,
          type: 'string',
          demandOption: true,
        })
        .option(flag.optionDataDirName, {
          alias: flag.optionDataDirAlias,
          description: flag.optionDataDirDescription,
          type: 'string',
          demandOption: true,
        })
        .option(common.optionVerboseName, { alias: common.optionVerboseAlias, description: common.optionVerboseDescription, type: 'boolean', default: false }),
    (args) => getHandler(args.dir, args.verbose).flag(args)
  )
  .command(
    index.command,
    index.description,
    (yargs) =>
      yargs
        .option(index.optionUserIdName, {
          alias: index.optionUserIdAlias,
          description: index.optionUserIdDescription,
          type: 'string',
          demandOption: true,
        })
        .option(index.optionDataDirName, {
          alias: index.optionDataDirAlias,
          description: index.optionDataDirDescription,
          type: 'string',
          demandOption: true,
        })
        .option(common.optionVerboseName, { alias: common.optionVerboseAlias, description: common.optionVerboseDescription, type: 'boolean', default: false }),
    (args) => getHandler(args.dir, args.verbose).index(args)
  )
  .parse();
