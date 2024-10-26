import { MyIdService } from '$lib/ui.services/MyIdService';

const obfuscateKey = 'ipaddress';

export const myIdService = new MyIdService(obfuscateKey);
