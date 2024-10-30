import { WatchService } from '$lib/ui.services/WatchService';
import { gateway } from './gateway';

export const watchService = new WatchService(gateway);
