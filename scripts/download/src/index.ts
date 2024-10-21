import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { OmdbManager } from './services/OmdbManager';
import { SubdlManager } from './services/SubdlManager';

// const imdbId = 'tt0105488'
// const imdbId = 'tt29623480'
// const imdbId = 'tt3896198'
// const imdbId = 'tt8864596'
// const imdbId = 'tt11315808'
// const imdbId = 'tt27911000'
// const imdbId = 'tt2049403'
// const imdbId = 'tt6263850'
// const imdbId = 'tt1609486'
// const imdbId = 'tt10655524';
// const imdbId = 'tt1340094';
// const imdbId = 'tt0088247';
// const imdbId = 'tt0103064';
const imdbId = 'tt17526714';

const run = async () => {
  const staticDir = path.resolve('..', '..', 'packages', 'app', 'static');

  const omdbManager = new OmdbManager('36145266');
  const subdlManager = new SubdlManager('LtcVJJcsmQruxW6zWkAoN4Jc_ymu7mmM', path.resolve('__zip__'));

  const { poster, ...omdbInfo } = await omdbManager.getInfo(imdbId);
  const subdlInfo = await subdlManager.getInfo(imdbId);

  const ext = path.parse(path.basename(poster)).ext;

  const response = await fetch(poster);
  const fileStream = fs.createWriteStream(path.resolve(staticDir, 'posters', `${imdbId}${ext}`));
  await promisify(pipeline)(response.body as unknown as NodeJS.ReadableStream, fileStream);

  const movie = { ...omdbInfo, ...subdlInfo, poster: `posters/${imdbId}${ext}` };
  fs.writeFileSync(path.resolve(staticDir, 'data', `${imdbId}.json`), JSON.stringify(movie, null, 2));

  const index: any[] = [];
  const dataDir = path.resolve(staticDir, 'data');
  const files = await fs.promises.readdir(dataDir);
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fullPath = path.join(dataDir, file);

    if (path.extname(file) === '.json' && file !== 'index.json') {
      const content = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
      const rec = { imdbId: content.imdbId, title: content.title, poster: content.poster };
      index.push(rec);
    }
  }

  fs.writeFileSync(path.resolve(staticDir, 'data', `index.json`), JSON.stringify(index, null, 2));
};

run();
