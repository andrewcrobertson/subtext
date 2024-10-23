import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { handler } from './composition/services';
import * as strings from './constants/strings';

Promise.resolve()
  .then(() =>
    yargs(hideBin(process.argv))
      .usage('Usage: process [options]')
      .options(strings.verboseName, { alias: strings.verboseAlias, describe: strings.verboseDescribe, type: 'boolean', default: false })
      .option(strings.downloadDataDirName, { alias: strings.downloadDataDirAlias, describe: strings.downloadDataDirDescribe, type: 'string' })
      .option(strings.downloadPosterDirName, { alias: strings.downloadPosterDirAlias, describe: strings.downloadPosterDirDescribe, type: 'string' })
      .parse()
  )
  .then((argv) => handler(argv.verbose).run(argv.dataDir, argv.posterDir));
