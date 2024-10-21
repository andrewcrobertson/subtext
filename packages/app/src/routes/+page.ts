import { base } from '$app/paths';
import type { PageLoad } from './$types';

interface Type {
  imdbId: string;
  title: string;
  poster: string;
}

export const load: PageLoad = async (event) => {
  const res = await event.fetch(`${base}/data/index.json`);
  const json: Type[] = await res.json();
  const titles = json.map(({ imdbId, title, poster }) => ({ id: imdbId, title, poster }));
  return { titles };
};
