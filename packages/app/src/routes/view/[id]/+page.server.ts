import { dataAccess } from '$lib/server.composition/dataAccess';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const data = dataAccess.getView(event.params.id);
  return data;
};
