import { replace } from 'lodash';

export const ensureForwardSlash = (text: string) => replace(text, /\\/g, '/');
