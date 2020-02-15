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
  dailySessionTimes: number[] = [5, 8 , 10];

  constructor(
    private firestoreService: FirestoreService,
    private statsService: StatsService
  ) { }

  ngOnInit(): void {
    this.firestoreService.getUserDataSnapshot()
      .subscribe((actionArray: Action<DocumentSnapshot<{ stats: Stats }>>) => {
        this.stats = actionArray.payload.data().stats;
      });
    this.statsService.setAverageMinutesPerDay();

    this.sessionTimeChart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: ['label 1', 'label 2', 'label 3'],
        datasets: [
          {
            data: this.dailySessionTimes,
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
  }
}
