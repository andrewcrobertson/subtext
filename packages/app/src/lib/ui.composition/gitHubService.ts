import { PUBLIC_REPO_TOKEN } from '$env/static/public';
import { GitHubService } from '$lib/ui.services/GitHubService';
import { myIdService } from './myIdService';

export const gitHubService = new GitHubService(PUBLIC_REPO_TOKEN, myIdService);
