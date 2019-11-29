import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Stats } from '../models/stats.model';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private _stats: Stats;
  readonly statsChanges: BehaviorSubject<Stats>;

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

  setStats(value: Partial<Stats>) {
    this._stats = JSON.parse(JSON.stringify({ ...this._stats, ...value }));
    this.statsChanges.next(this._stats);
  }

  getStats(): Partial<Stats> {
    return JSON.parse(JSON.stringify(this._stats));
  }

  addTotalSessionTime() {
    this._stats = JSON.parse(JSON.stringify({
      ...this._stats,
      totalSessionTime: this._stats.totalSessionTime + 1
    }));
    this.statsChanges.next(this._stats);
  }

  addCompletedSession() {
    this._stats = JSON.parse(JSON.stringify({
      ...this._stats,
      completedSessions: this._stats.completedSessions + 1
    }));
    this.statsChanges.next(this._stats);
  }

  checkForLongestPeriod(currentMaxPeriodLength) {
    if (currentMaxPeriodLength > this._stats.longestPeriod) {
      this._stats = JSON.parse(JSON.stringify({
        ...this._stats,
        longestPeriod: currentMaxPeriodLength
      }));
    }
    this.statsChanges.next(this._stats);
  }

  checkForLongestSessionCompleted(currentSessionLength) {
    if (currentSessionLength > this._stats.longestSession) {
      this._stats = JSON.parse(JSON.stringify({
        ...this._stats,
        longestSession: currentSessionLength
      }));
    }
    this.statsChanges.next(this._stats);
  }
}
