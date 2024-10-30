import { RequestService } from '$lib/ui.services/RequestService';
import { gateway } from './gateway';
import { userIdService } from './myIdService';

export const requestService = new RequestService(userIdService, gateway);
