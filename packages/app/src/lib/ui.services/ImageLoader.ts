export class ImageLoader {
  public async load(url: string) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(true);
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    });
  }
}
