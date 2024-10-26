import { handler } from '$composition/services';
import * as strings from '$constants/strings';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

Promise.resolve()
  .then(() =>
    yargs(hideBin(process.argv))
      .usage('Usage: download [options]')
      .options(strings.verboseName, { alias: strings.verboseAlias, describe: strings.verboseDescribe, type: 'boolean', default: false })
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
      .parse()
  )
  .then((argv) => handler(argv.verbose).run(argv));
