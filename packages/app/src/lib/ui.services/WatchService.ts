import type { Gateway } from './Gateway.types';
import type * as T from './WatchService.types';

export class WatchService {
  public constructor(private readonly gateway: Gateway) {}

  public async load(imdbId: string): Promise<T.LoadOutput> {
    const movie = await this.gateway.getMovieWithSubtitles(imdbId);
    return { movie: movie! };
  }
}
