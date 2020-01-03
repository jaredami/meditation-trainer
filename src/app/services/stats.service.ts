import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Stats } from '../models/stats.model';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private _stats: Stats;
  readonly statsChanges: BehaviorSubject<Stats>;
  // TODO: store date of the first login for this
  private dateStarted: number = 1576818000000;
  private today: number = Date.now();

  constructor() {
    this._stats = {
      completedSessions: 0,
      totalSessionTime: 0,
      averageSessionTime: 0,
      longestSession: 0,
      longestPeriod: 0,
    };
    this.statsChanges = new BehaviorSubject<Stats>(this._stats);
  }

  setStats(value: Partial<Stats>): void {
    this._stats = JSON.parse(JSON.stringify({ ...this._stats, ...value }));
    this.statsChanges.next(this._stats);
  }

  getStats(): Partial<Stats> {
    return JSON.parse(JSON.stringify(this._stats));
  }

  addTotalSessionTime(): void {
    this._stats = JSON.parse(JSON.stringify({
      ...this._stats,
      totalSessionTime: this._stats.totalSessionTime + 1
    }));
    this.statsChanges.next(this._stats);
  }

  addCompletedSession(): void {
    this._stats = JSON.parse(JSON.stringify({
      ...this._stats,
      completedSessions: this._stats.completedSessions + 1
    }));
    this.statsChanges.next(this._stats);
  }

  checkForLongestPeriod(currentMaxPeriodLength: number): void {
    if (currentMaxPeriodLength > this._stats.longestPeriod) {
      this._stats = JSON.parse(JSON.stringify({
        ...this._stats,
        longestPeriod: currentMaxPeriodLength
      }));
    }
    this.statsChanges.next(this._stats);
  }

  checkForLongestSessionCompleted(currentSessionLength: number): void {
    if (currentSessionLength > this._stats.longestSession) {
      this._stats = JSON.parse(JSON.stringify({
        ...this._stats,
        longestSession: currentSessionLength
      }));
    }
    this.statsChanges.next(this._stats);
  }

  setAverageMinutesPerDay(): void {
    const dateDiff: number = Math.round((this.today - this.dateStarted) / (1000 * 60 * 60 * 24));
    const average: number = Math.round(this._stats.totalSessionTime / dateDiff);

    this._stats = JSON.parse(JSON.stringify({
      ...this._stats,
      averageSessionTime: average
    }));
    this.statsChanges.next(this._stats);
  }
}
