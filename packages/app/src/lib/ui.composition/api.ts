import { ApiFetch } from '$lib/ui.services/ApiFetch';
import { ApiMemoryCache } from '$lib/ui.services/ApiMemoryCache';
import { baseApi } from './baseApi';

export const apiFetch = new ApiFetch(baseApi);
export const api = new ApiMemoryCache(apiFetch);
