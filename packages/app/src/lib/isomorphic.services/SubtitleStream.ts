import { Stopwatch } from './StopWatch';

export interface SubtitleSection {
  start: number;
  end: number;
  text: string;
}

export class SubtitleStream {
  private stopwatch = new Stopwatch();

  public constructor(private readonly subtitles: SubtitleSection[]) {}

  public start() {
    this.stopwatch.start();
  }

  public pause() {
    this.stopwatch.stop();
  }

  public goTo(percentage: number) {
    const runningTime = this.getRunningTime();
    const ms = Math.round((percentage * runningTime) / 100);
    this.stopwatch.resetTo(ms);
  }

  public skipToNext() {
    const elapsedTime = this.stopwatch.getElapsedTime();
    for (let i = 0; i < this.subtitles.length; i++) {
      const subtitle = this.subtitles[i];
      if (subtitle.start > elapsedTime) {
        this.stopwatch.resetTo(subtitle.start);
        return;
      }
    }

    this.stopwatch.resetTo(this.getRunningTime());
  }

  public skipToPrevious() {
    const elapsedTime = this.stopwatch.getElapsedTime();
    for (let i = this.subtitles.length - 1; i >= 0; i--) {
      const subtitle = this.subtitles[i];
      if (subtitle.end < elapsedTime) {
        this.stopwatch.resetTo(subtitle.start);
        return;
      }
    }

    this.stopwatch.resetTo(0);
  }

  public getCurrentFrame() {
    const elapsedTime = this.stopwatch.getElapsedTime();
    const subtitle = this.getCurrentSubtitle(elapsedTime);
    const progress = this.getPercentageProgress(elapsedTime);
    return { subtitle, progress };
  }

  public getRemainingTime() {
    const runningTime = this.getRunningTime();
    const elapsedTime = this.stopwatch.getElapsedTime();
    return Math.max(runningTime - elapsedTime, 0);
  }

  public getElapsedTime() {
    return this.stopwatch.getElapsedTime();
  }

  private getCurrentSubtitle(elapsedTime: number) {
    for (let i = 0; i < this.subtitles.length; i++) {
      const subtitle = this.subtitles[i];
      if (elapsedTime >= subtitle.start && elapsedTime <= subtitle.end) return this.subtitles[i].text;
    }

    return '';
  }

  private getPercentageProgress(elapsedTime: number) {
    const runningTime = this.getRunningTime();
    const percentageProgress = elapsedTime === 0 ? 0 : (Math.min(elapsedTime, runningTime) / runningTime) * 100;
    return percentageProgress;
  }

  private getRunningTime() {
    const oneMinute = 1000 * 60 * 1;
    const lastSubtitleEnd = this.subtitles[this.subtitles.length - 1].end;
    const runningTime = lastSubtitleEnd + oneMinute;
    return runningTime;
  }
}
