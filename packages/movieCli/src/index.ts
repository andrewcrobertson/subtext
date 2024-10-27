import { getHandler } from '$composition/services';
import * as common from '$constants/common';
import * as flag from '$constants/flag';
import * as load from '$constants/load';
import * as merge from '$constants/merge';
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
        .option(merge.optionUserIdName, {
          alias: merge.optionUserIdAlias,
          description: merge.optionUserIdDescription,
          type: 'string',
          demandOption: true,
        })
        .option(load.optionImdbIdName, {
          alias: load.optionImdbIdAlias,
          description: load.optionImdbIdDescription,
          type: 'string',
          demandOption: true,
        })
        .option(load.optionLogDirName, {
          alias: load.optionLogDirAlias,
          description: load.optionLogDirDescription,
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
    (args) => getHandler(args.verbose).load(args)
  )
  .command(
    remove.command,
    remove.description,
    (yargs) =>
      yargs
        .option(merge.optionUserIdName, {
          alias: merge.optionUserIdAlias,
          description: merge.optionUserIdDescription,
          type: 'string',
          demandOption: true,
        })
        .option(remove.optionImdbIdName, {
          alias: remove.optionImdbIdAlias,
          description: remove.optionImdbIdDescription,
          type: 'string',
          demandOption: true,
        })
        .option(remove.optionLogDirName, {
          alias: remove.optionLogDirAlias,
          description: remove.optionLogDirDescription,
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
    (args) => getHandler(args.verbose).remove(args)
  )
  .command(
    flag.command,
    flag.description,
    (yargs) =>
      yargs
        .option(merge.optionUserIdName, {
          alias: merge.optionUserIdAlias,
          description: merge.optionUserIdDescription,
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
        .option(flag.optionLogDirName, {
          alias: flag.optionLogDirAlias,
          description: flag.optionLogDirDescription,
          type: 'string',
          demandOption: true,
        })
        .option(common.optionVerboseName, { alias: common.optionVerboseAlias, description: common.optionVerboseDescription, type: 'boolean', default: false }),
    (args) => getHandler(args.verbose).flag(args)
  )
  .command(
    merge.command,
    merge.description,
    (yargs) =>
      yargs
        .option(merge.optionUserIdName, {
          alias: merge.optionUserIdAlias,
          description: merge.optionUserIdDescription,
          type: 'string',
          demandOption: true,
        })
        .option(merge.optionLogDirName, {
          alias: merge.optionLogDirAlias,
          description: merge.optionLogDirDescription,
          type: 'string',
          demandOption: true,
        })
        .option(merge.optionDataDirName, {
          alias: merge.optionDataDirAlias,
          description: merge.optionDataDirDescription,
          type: 'string',
          demandOption: true,
        })
        .option(common.optionVerboseName, { alias: common.optionVerboseAlias, description: common.optionVerboseDescription, type: 'boolean', default: false }),
    (args) => getHandler(args.verbose).merge(args)
  )
  .parse();
