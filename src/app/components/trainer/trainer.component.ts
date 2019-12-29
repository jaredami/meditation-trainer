import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { StatsService } from 'src/app/services/stats.service';

@Component({
  selector: 'app-trainer',
  templateUrl: './trainer.component.html',
  styleUrls: ['./trainer.component.scss']
})
export class TrainerComponent implements OnInit, OnDestroy {
  circleAnimationStarted = true;

  currentMaxPeriodLength: number;
  periodSeconds = 0;
  periodMinutes = 0;
  periodComplete = false;
  periodTimer = '--:--';
  startPeriodTimer;

  currentSessionLength: number;
  sessionStarted = false;
  sessionEnded = false;
  sessionSeconds = 0;
  sessionMinutes: number;
  sessionTimer = '--:--';
  startSessionTimer;

  firstSessionStarted = false;

  @ViewChild('periodAudio') periodAudioRef: ElementRef;
  @ViewChild('sessionAudio') sessionAudioRef: ElementRef;

  constructor(
    private settingsService: SettingsService,
    private statsService: StatsService
  ) {}

  ngOnInit() {
    this.settingsService.settingsChanges.subscribe((settingsUpdate) => {
      this.currentMaxPeriodLength = settingsUpdate.startingPeriodLength;
      this.sessionMinutes = settingsUpdate.startingSessionLength;
      this.currentSessionLength = this.sessionMinutes;
    });
  }

  ngOnDestroy() {
    clearInterval(this.startPeriodTimer);
    clearInterval(this.startSessionTimer);
  }

  // Public methods

  increaseSessionLength() {
    this.sessionMinutes++;
    this.currentSessionLength = this.sessionMinutes;
  }

  decreaseSessionLength() {
    if (this.sessionMinutes > 0) {
      this.sessionMinutes--;
      this.currentSessionLength = this.sessionMinutes;
    }
  }

  handleSuccessFailClick(success: boolean) {
    success ? this.currentMaxPeriodLength++ : this.currentMaxPeriodLength--;

    this.circleAnimationStarted = false;
    setTimeout(() => {
      this.periodSeconds = 0;
      this.periodComplete = false;
      this.startPeriodTimer = setInterval(() => { this.addPeriodTime(); }, 10);
      this.circleAnimationStarted = true;
    }, 100);
  }

  startSession() {
    this.resetValues();
    this.firstSessionStarted = true;
    this.startSessionTimer = setInterval(() => { this.subtractSessionTime(); }, 10);
    this.startPeriodTimer = setInterval(() => { this.addPeriodTime(); }, 10);
    this.sessionStarted = true;
  }

  // Private methods

  private addPeriodTime() {
    if (this.periodSeconds < this.currentMaxPeriodLength) {
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
      // ! BUG: doesn't hit this if currentMaxPeriodLength is greater than 60
      this.completePeriod();
    }
  }

  private subtractSessionTime() {
    if (this.sessionMinutes > -1) {
      this.sessionSeconds--;
      if (this.sessionSeconds <= 0) {
        if (this.sessionMinutes === 0) {
          this.completeSession();
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
    this.currentMaxPeriodLength = this.settingsService.getSettings().startingPeriodLength;
    this.periodSeconds = 0;
    this.periodMinutes = 0;
    this.periodComplete = false;

    this.sessionStarted = false;
    this.sessionEnded = false;
    this.sessionSeconds = 0;
    this.sessionMinutes = this.settingsService.getSettings().startingSessionLength;
    this.sessionTimer = '--:--';
  }

  private completePeriod() {
    this.playPeriodEndSound();
    this.periodComplete = true;
    clearInterval(this.startPeriodTimer);
    this.statsService.checkForLongestPeriod(this.currentMaxPeriodLength);
  }

  private completeSession() {
    this.playSessionEndSound();
    this.sessionStarted = false;
    this.sessionEnded = true;
    clearInterval(this.startPeriodTimer);
    clearInterval(this.startSessionTimer);
    this.statsService.addCompletedSession();
    this.statsService.checkForLongestSessionCompleted(this.currentSessionLength);
  }

  // Sound methods

  private playPeriodEndSound() {
    this.periodAudioRef.nativeElement.load();
    this.periodAudioRef.nativeElement.play();
  }

  private playSessionEndSound() {
    this.sessionAudioRef.nativeElement.load();
    this.sessionAudioRef.nativeElement.play();
  }

  // Styles

  successFailBtnStyle(): { opacity: number, cursor: string } {
    return this.periodComplete ? { opacity: 1, cursor: 'pointer' } : { opacity: 0, cursor: 'default' };
  }
}


