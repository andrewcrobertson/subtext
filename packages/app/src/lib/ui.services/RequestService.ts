import type { Gateway } from './Gateway.types';
import type * as T from './RequestService.types';
import type { UserIdService } from './UserIdService';

export class RequestService {
  public constructor(
    private readonly userIdService: UserIdService,
    private readonly gateway: Gateway
  ) {}

  public async submitRequest(imdbIdOrImdbUrl: string): Promise<T.SubmitRequestOutput> {
    const userId = await this.userIdService.getMyId();
    const imdbId = this.parseImdbIdOrUrl(imdbIdOrImdbUrl);

    if (imdbId === null) return { code: 'INVALID_INPUT' };

    const movie = await this.gateway.getMovie(imdbId);
    if (movie !== null) return { code: 'ALREADY_EXISTS', movie };

    const success = await this.gateway.submitAddMovieRequestIssue(userId, imdbId);
    if (success) return { code: 'REQUEST_SUBMITTED' };

    return { code: 'UNEXPECTED_ERROR' };
  }

  public getImdbQueryUrl(query: string): string {
    return `https://www.imdb.com/find/?q=${query}&s=tt&ttype=ft&ref_=subtext`;
  }

  public async updateIsOnMyList(imdbId: string, isOnMyList: boolean): Promise<void> {
    const userId = await this.userIdService.getMyId();
    if (isOnMyList) {
      await this.gateway.addToMyList(userId, imdbId);
    } else {
      await this.gateway.removeFromMyList(userId, imdbId);
    }
  }

  private parseImdbIdOrUrl(value: string) {
    const match = value.match(/tt\d{7,8}/);
    return match ? match[0] : null;
  }
}
