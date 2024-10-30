import type { Gateway } from './Gateway.types';
import type * as T from './HomeService.types';
import type { UserIdService } from './UserIdService';

export class HomeService {
  public constructor(
    private readonly userIdService: UserIdService,
    private readonly gateway: Gateway
  ) {}

  public async load(): Promise<T.LoadOutput> {
    const userId = await this.userIdService.getMyId();
    const myListMovies: T.LoadOutputMovie[] = await this.gateway.getMyListMovies(userId);
    return { myListMovies };
  }

  public async removeFromMyList(imdbId: string): Promise<void> {
    const userId = await this.userIdService.getMyId();
    await this.gateway.removeFromMyList(userId, imdbId);
  }
}
