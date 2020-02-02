import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Action, AngularFirestore, DocumentSnapshot } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';
import { Settings } from 'src/app/models/settings.model';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { SettingsService } from 'src/app/services/settings/settings.service';
import { StatsService } from 'src/app/services/stats/stats.service';

@Component({
  selector: 'app-trainer',
  templateUrl: './trainer.component.html',
  styleUrls: ['./trainer.component.scss']
})
export class TrainerComponent implements OnInit, OnDestroy {
  // Period
  currentMaxPeriodLength: number;
  periodSeconds: number = 0;
  periodMinutes: number = 0;
  periodComplete: boolean = false;
  periodTimer: string = '--:--';
  startPeriodTimer: number;

  // Session
  currentSessionLength: number;
  sessionStarted: boolean = false;
  sessionEnded: boolean = false;
  sessionSeconds: number = 0;
  sessionMinutes: number;
  sessionTimer: string = '--:--';
  startSessionTimer: number;

  circleAnimationStarted: boolean = true;
  firstSessionStarted: boolean = false;

  periodEndSoundSrc: string;
  sessionEndSoundSrc: string;

  @ViewChild('periodAudio') periodAudioRef: ElementRef;
  @ViewChild('sessionAudio') sessionAudioRef: ElementRef;

  constructor(
    private afs: AngularFirestore,
    private firestoreService: FirestoreService,
    private settingsService: SettingsService,
    private statsService: StatsService
  ) {}

  ngOnInit(): void {
    this.firestoreService.getUserDataSnapshot().pipe(take(1))
      .subscribe((actionArray: Action<DocumentSnapshot<{ settings: Settings }>>) => {
        const settingsUpdate: Settings = actionArray.payload.data().settings;

        this.currentMaxPeriodLength = settingsUpdate.startingPeriodLength;
        this.sessionMinutes = settingsUpdate.startingSessionLength;
        this.currentSessionLength = this.sessionMinutes;
        this.periodEndSoundSrc = settingsUpdate.periodEndSoundSrc;
        this.sessionEndSoundSrc = settingsUpdate.sessionEndSoundSrc;
      });
  }

  ngOnDestroy(): void {
    clearInterval(this.startPeriodTimer);
    clearInterval(this.startSessionTimer);
  }

  // Public methods

  increaseSessionLength(): void {
    this.sessionMinutes++;
    this.currentSessionLength = this.sessionMinutes;
  }

  decreaseSessionLength(): void {
    if (this.sessionMinutes > 0) {
      this.sessionMinutes--;
      this.currentSessionLength = this.sessionMinutes;
    }
  }

  handleSuccessFailClick(success: boolean): void {
    success ? this.currentMaxPeriodLength++ : this.currentMaxPeriodLength--;

    this.circleAnimationStarted = false;
    setTimeout(() => {
      this.periodSeconds = 0;
      this.periodComplete = false;
      this.startPeriodTimer = window.setInterval(() => { this.addPeriodTime(); }, 1000);
      this.circleAnimationStarted = true;
    }, 100);
  }

  startSession(): void {
    this.resetValues();
    this.firstSessionStarted = true;
    this.startSessionTimer = window.setInterval(() => { this.subtractSessionTime(); }, 1000);
    this.startPeriodTimer = window.setInterval(() => { this.addPeriodTime(); }, 1000);
    this.sessionStarted = true;
  }

  // Private methods

  private addPeriodTime(): void {
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

  private subtractSessionTime(): void {
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

  private resetValues(): void {
    this.circleAnimationStarted = true;
    this.periodSeconds = 0;
    this.periodMinutes = 0;
    this.periodComplete = false;
    this.periodTimer = '--:--';

    this.sessionStarted = false;
    this.sessionEnded = false;
    this.sessionSeconds = 0;
    this.sessionTimer = '--:--';

    this.firestoreService.getUserDataSnapshot().pipe(take(1))
    .subscribe((actionArray: Action<DocumentSnapshot<{ settings: Settings }>>) => {
      const settingsUpdate: Settings = actionArray.payload.data().settings;

      this.currentMaxPeriodLength = settingsUpdate.startingPeriodLength;
      this.sessionMinutes = settingsUpdate.startingSessionLength;
    });
  }

  private completePeriod(): void {
    this.playPeriodEndSound();
    this.periodComplete = true;
    clearInterval(this.startPeriodTimer);
    this.statsService.checkForLongestPeriod(this.currentMaxPeriodLength);
  }

  private completeSession(): void {
    this.playSessionEndSound();
    this.sessionStarted = false;
    this.sessionEnded = true;
    clearInterval(this.startPeriodTimer);
    clearInterval(this.startSessionTimer);
    this.statsService.addCompletedSession();
    this.statsService.checkForLongestSessionCompleted(this.currentSessionLength);
  }

  // Sound methods

  private playPeriodEndSound(): void {
    this.periodAudioRef.nativeElement.load();
    this.periodAudioRef.nativeElement.play();
  }

  private playSessionEndSound(): void {
    this.sessionAudioRef.nativeElement.load();
    this.sessionAudioRef.nativeElement.play();
  }

  // Styles

  successFailBtnStyle(): { opacity: number, cursor: string } {
    return (this.periodComplete && !this.sessionEnded) ?
      { opacity: 1, cursor: 'pointer' } :
      { opacity: 0, cursor: 'default' };
  }
}


