import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trainer',
  templateUrl: './trainer.component.html',
  styleUrls: ['./trainer.component.scss']
})
export class TrainerComponent implements OnInit {
  currentStreakTimer = '0';
  sessionTimer = '5:00';
  seconds = 0;
  minutes = 0;
  currentMax = 10;
  startStreakTimer;
  sessionStarted = false;
  seconds2 = 0;
  minutes2 = 20;

  constructor() { }

  ngOnInit() {

    this.startStreakTimer = setInterval(() => { this.addTime(); }, 1000);
  }

  addTime() {
    console.log('addTime called');
    console.log('seconds', this.seconds);
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
      clearInterval(this.startStreakTimer);
    }
  }
}
