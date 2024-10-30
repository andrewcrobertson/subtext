import { SearchService } from '$lib/ui.services/SearchService';
import { gateway } from './gateway';
import { userIdService } from './myIdService';

export const searchService = new SearchService(userIdService, gateway);
