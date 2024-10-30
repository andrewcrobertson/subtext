import { HomeService } from '$lib/ui.services/HomeService';
import { gateway } from './gateway';
import { userIdService } from './myIdService';

export const homeService = new HomeService(userIdService, gateway);
