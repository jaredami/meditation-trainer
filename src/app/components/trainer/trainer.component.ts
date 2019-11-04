import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trainer',
  templateUrl: './trainer.component.html',
  styleUrls: ['./trainer.component.scss']
})
export class TrainerComponent implements OnInit {
  currentStreakTimer = '--:--';
  sessionTimer = '--:--';
  seconds = 0;
  minutes = 0;
  currentMax = 5;
  startStreakTimer;
  startSessionTimer;
  sessionStarted = false;
  seconds2 = 0;
  minutes2 = 20;
  periodComplete = false;
  circleAnimationStarted = true;

  constructor() {}

  ngOnInit() {
    this.startStreakTimer = setInterval(() => { this.addTime(); }, 1000);
    this.startSessionTimer = setInterval(() => { this.subtractTime(); }, 1000);
  }

  increaseSessionLength() {
    this.minutes2++;
  }

  decreaseSessionLength() {
    this.minutes2--;
  }

  handleSuccessFailClick(success: boolean) {
    success ? this.currentMax++ : this.currentMax--;

    // reset circle animation
    this.circleAnimationStarted = false;
    setTimeout(() => {
      this.seconds = 0;
      this.periodComplete = false;
      this.startStreakTimer = setInterval(() => { this.addTime(); }, 1000);
      this.circleAnimationStarted = true;
    }, 100);
  }

  private addTime() {
    if (this.seconds < this.currentMax) {
      this.seconds++;
      if (this.seconds >= 60) {
        this.seconds = 0;
        this.minutes++;
      }
      this.currentStreakTimer =
        (this.minutes ? (this.minutes > 9 ? this.minutes : '0' + this.minutes) : '00') +
        ':' +
        (this.seconds > 9 ? this.seconds : '0' + this.seconds);
    } else {
      // BUG: doesn't hit this if currentMax is greater than 60
      this.periodComplete = true;
      clearInterval(this.startStreakTimer);
    }
  }

  private subtractTime() {
    if (this.minutes2 > -1) {
      this.seconds2--;
      if (this.seconds2 <= 0) {
        this.seconds2 = 59;
        this.minutes2--;
      }
      this.sessionTimer =
        (this.minutes2 ? (this.minutes2 > 9 ? this.minutes2 : '0' + this.minutes2) : '00') +
        ':' +
        (this.seconds2 > 9 ? this.seconds2 : '0' + this.seconds2);
    }
  }
}
