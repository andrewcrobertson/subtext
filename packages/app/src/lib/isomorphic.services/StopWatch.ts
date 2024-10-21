export class Stopwatch {
  private elapsedTime = 0;
  private startTimestamp: number | null = null;

  public start() {
    this.startTimestamp = Date.now();
  }

  public stop() {
    if (this.startTimestamp !== null) {
      this.elapsedTime += Date.now() - this.startTimestamp;
      this.startTimestamp = null;
    }
  }

  public resetTo(milliseconds: number) {
    if (this.startTimestamp !== null) this.startTimestamp = Date.now();
    this.elapsedTime = milliseconds;
  }

  public reset() {
    this.resetTo(0);
  }

  public getElapsedTime() {
    return this.elapsedTime + (this.startTimestamp === null ? 0 : Date.now() - this.startTimestamp);
  }
}
