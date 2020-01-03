import { Component, OnInit } from '@angular/core';
import { Stats } from 'src/app/models/stats.model';
import { StatsService } from 'src/app/services/stats.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  stats: Stats;

  constructor(
    private statsService: StatsService
  ) { }

  ngOnInit(): void {
    this.statsService.statsChanges.subscribe((update: Stats) => this.stats = update);
    this.statsService.setAverageMinutesPerDay();
  }
}
