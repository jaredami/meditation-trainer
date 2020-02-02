import { Component, OnInit } from '@angular/core';
import { Action, DocumentSnapshot } from '@angular/fire/firestore';
import { Stats } from 'src/app/models/stats.model';
import { StatsService } from 'src/app/services/stats/stats.service';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';

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
  }
}
