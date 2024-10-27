import fs from 'fs';
import { cloneDeep, omit, set } from 'lodash';
import path from 'path';
import { pipeline } from 'stream';
import { isDeepStrictEqual, promisify } from 'util';

export class FileManager {
  public constructor(private readonly dbDir: string) {}

  public async getIndex(imdbId: string) {}

  public async writeImageFile(filePath: string, url: string) {
    this.ensureDir(filePath);
    const response = await fetch(url);
    const fileStream = fs.createWriteStream(filePath);
    await promisify(pipeline)(response.body as unknown as NodeJS.ReadableStream, fileStream);
  }

  public async writeTextFile(filePath: string, fileContent: string) {
    this.ensureDir(filePath);
    fs.writeFileSync(filePath, fileContent);
  }

  public async writeJsonFile(filePath: string, fileContent: any, timestamp: string) {
    this.ensureDir(filePath);

    const newFileContent = cloneDeep(fileContent);
    set(newFileContent, ['lastSynced'], timestamp);

    if (fs.existsSync(filePath)) {
      const currFileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const currFileContentRaw = omit(currFileContent, ['lastSynced', 'lastModified']);
      const newFileContentRaw = omit(newFileContent, ['lastSynced', 'lastModified']);
      if (isDeepStrictEqual(currFileContentRaw, newFileContentRaw)) {
        set(newFileContent, ['lastModified'], currFileContent.lastModified ?? timestamp);
      } else {
        set(newFileContent, ['lastModified'], timestamp);
      }
    } else {
      set(newFileContent, ['lastModified'], timestamp);
    }

    fs.writeFileSync(filePath, JSON.stringify(newFileContent, null, 2));
  }

  private ensureDir(filePath: string) {
    fs.mkdirSync(path.resolve(filePath, '..'), { recursive: true });
  }
}
