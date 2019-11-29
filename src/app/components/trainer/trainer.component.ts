import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { StatsService } from 'src/app/services/stats.service';

@Component({
  selector: 'app-trainer',
  templateUrl: './trainer.component.html',
  styleUrls: ['./trainer.component.scss']
})
export class TrainerComponent implements OnInit {
  circleAnimationStarted = true;

  currentMax: number;
  periodSeconds = 0;
  periodMinutes = 0;
  periodComplete = false;
  periodTimer = '--:--';
  startPeriodTimer;

  sessionStarted = false;
  sessionEnded = false;
  sessionSeconds = 0;
  sessionMinutes: number;
  sessionTimer = '--:--';
  startSessionTimer;

  firstSessionStarted = false;

  constructor(
    private settingsService: SettingsService,
    private statsService: StatsService
  ) {}

  ngOnInit() {
    this.settingsService.settingsChanges.subscribe((settingsUpdate) => {
      this.currentMax = settingsUpdate.startingPeriodLength;
      this.sessionMinutes = settingsUpdate.startingSessionLength;
    });
  }

  increaseSessionLength() {
    this.sessionMinutes++;
  }

  decreaseSessionLength() {
    if (this.sessionMinutes > 0) {
      this.sessionMinutes--;
    }
  }

  handleSuccessFailClick(success: boolean) {
    success ? this.currentMax++ : this.currentMax--;

    this.circleAnimationStarted = false;
    setTimeout(() => {
      this.periodSeconds = 0;
      this.periodComplete = false;
      this.startPeriodTimer = setInterval(() => { this.addPeriodTime(); }, 1000);
      this.circleAnimationStarted = true;
    }, 100);
  }

  startSession() {
    this.resetValues();
    this.firstSessionStarted = true;
    this.startSessionTimer = setInterval(() => { this.subtractSessionTime(); }, 1000);
    this.startPeriodTimer = setInterval(() => { this.addPeriodTime(); }, 1000);
    this.sessionStarted = true;
  }

  private addPeriodTime() {
    if (this.periodSeconds < this.currentMax) {
      this.periodSeconds++;
      if (this.periodSeconds >= 60) {
        this.periodSeconds = 0;
        this.periodMinutes++;
      }
      this.periodTimer =
        (this.periodMinutes ? (this.periodMinutes > 9 ? this.periodMinutes : '0' + this.periodMinutes) : '00') +
        ':' +
        (this.periodSeconds > 9 ? this.periodSeconds : '0' + this.periodSeconds);
    } else {
      // ! BUG: doesn't hit this if currentMax is greater than 60
      this.periodComplete = true;
      clearInterval(this.startPeriodTimer);
      this.statsService.checkForLongestPeriod(this.currentMax);
    }
  }

  private subtractSessionTime() {
    if (this.sessionMinutes > -1) {
      this.sessionSeconds--;
      if (this.sessionSeconds <= 0) {
        if (this.sessionMinutes === 0) {
          this.endSession();
        } else {
          this.sessionSeconds = 59;
          this.sessionMinutes--;
          this.statsService.addTotalSessionTime();
        }
      }

      this.sessionTimer =
        (this.sessionMinutes ? (this.sessionMinutes > 9 ? this.sessionMinutes : '0' + this.sessionMinutes) : '00') +
        ':' +
        (this.sessionSeconds > 9 ? this.sessionSeconds : '0' + this.sessionSeconds);
    }
  }

  private resetValues() {
    this.circleAnimationStarted = true;
    this.periodTimer = '--:--';
    this.currentMax = this.settingsService.getSettings().startingPeriodLength;
    this.periodSeconds = 0;
    this.periodMinutes = 0;
    this.periodComplete = false;

    this.sessionStarted = false;
    this.sessionEnded = false;
    this.sessionSeconds = 0;
    this.sessionMinutes = this.settingsService.getSettings().startingSessionLength;
    this.sessionTimer = '--:--';
  }

  private endSession() {
    this.sessionStarted = false;
    this.sessionEnded = true;
    clearInterval(this.startPeriodTimer);
    clearInterval(this.startSessionTimer);
    this.statsService.addCompletedSession();
  }
}
