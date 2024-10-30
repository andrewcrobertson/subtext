import type { Gateway } from './Gateway.types';
import type * as T from './SearchService.types';
import type { UserIdService } from './UserIdService';

export class SearchService {
  public constructor(
    private readonly userIdService: UserIdService,
    private readonly gateway: Gateway
  ) {}

  public async load(): Promise<T.LoadOutput> {
    const recentMovies = await this.gateway.getRecentMovies();
    return { recentMovies };
  }

  public async search(query: string): Promise<T.SearchOutput[]> {
    if (query === '') return [];
    const matchingMovies: T.SearchOutput[] = await this.gateway.searchMovies(query);
    return matchingMovies;
  }

  public async updateIsOnMyList(imdbId: string, isOnMyList: boolean): Promise<void> {
    const userId = await this.userIdService.getMyId();
    if (isOnMyList) {
      await this.gateway.addToMyList(userId, imdbId);
    } else {
      await this.gateway.removeFromMyList(userId, imdbId);
    }
  }
}
