import { Component, OnInit } from '@angular/core';
import { Action, DocumentSnapshot } from '@angular/fire/firestore';
import { Chart } from 'chart.js';
import { Stats } from 'src/app/models/stats.model';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { StatsService } from 'src/app/services/stats/stats.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  stats: Stats = {
    completedSessions: 0,
    totalSessionTime: 0,
    averageSessionTime: 0,
    longestSession: 0,
    longestPeriod: 0,
  };

  sessionTimeChart: [] = [];
  dates: any;
  sessionTimes: any;

  constructor(
    private firestoreService: FirestoreService,
    private statsService: StatsService
  ) { }

  ngOnInit(): void {
    this.firestoreService.getUserDataSnapshot()
      .subscribe((actionArray: Action<DocumentSnapshot<any>>) => {
        this.stats = actionArray.payload.data().stats;

        const dailySessionTimes: any = actionArray.payload.data().dailySessionTimes;

        this.sessionTimes = dailySessionTimes.sessionTimes;
        this.dates = dailySessionTimes.dates.map((timestamp: any) => {
          let month: number;
          let day: number;

          const date: Date = new Date(timestamp.seconds * 1000);
          month = date.getUTCMonth() + 1;
          day = date.getUTCDate();

          return `${month}/${day}`;
        });

        this.sessionTimeChart = new Chart('canvas', {
          type: 'line',
          data: {
            labels: this.dates,
            datasets: [
              {
                data: this.sessionTimes,
                borderColor: '#3cba9f',
                fill: false
              },
            ]
          },
          options: {
            legend: {
              display: false
            },
            scales: {
              xAxes: [{
                display: true
              }],
              yAxes: [{
                display: true
              }],
            }
          }
        });
      });
    this.statsService.setAverageMinutesPerDay();


  }
}
