import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Settings } from '../models/settings.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private _settings: Settings;
  readonly settingsChanges: BehaviorSubject<Settings>;

  constructor() {
    this._settings = {
      startingPeriodLength: 10,
      startingSessionLength: 10,
    };
    this.settingsChanges = new BehaviorSubject<Settings>(this._settings);
  }

  setSettings(value: Partial<Settings>) {
    this._settings = JSON.parse(JSON.stringify({ ...this._settings, ...value }));
    this.settingsChanges.next(this._settings);
  }

  getSettings(): Settings {
    return JSON.parse(JSON.stringify(this._settings));
  }
}