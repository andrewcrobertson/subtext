import { base } from '$app/paths';
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
  const res = await event.fetch(`${base}/data/${event.params.id}.json`);
  const json: any = await res.json();
  return { title: json.title, subtitles: json.options[0].subtitles };
};
