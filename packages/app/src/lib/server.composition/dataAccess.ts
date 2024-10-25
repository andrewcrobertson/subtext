import { dev } from '$app/environment';
import { DataAccess } from '$lib/server.services/DataAccess';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = dev ? path.resolve(__dirname, '..', '..', '..') : process.cwd();
const dirPath = path.resolve(rootDir, '..', '..', '__data__');

export const dataAccess = new DataAccess(dirPath);
