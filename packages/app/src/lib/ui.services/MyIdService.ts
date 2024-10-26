export class MyIdService {
  public constructor(private readonly obfuscateKey: string) {}

  public async getId() {
    try {
      const res = await fetch('https://api.ipify.org/');
      if (res.ok) return this.obfuscate(await res.text(), this.obfuscateKey);
    } catch {}

    return this.obfuscate('Unknown', this.obfuscateKey);
  }

  private obfuscate(text: string, key: string): string {
    const ipBytes = new TextEncoder().encode(text);
    const keyBytes = new TextEncoder().encode(key);
    const result = ipBytes.map((byte, i) => byte ^ keyBytes[i % keyBytes.length]);
    return Array.from(result)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }
}
