import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { Settings } from 'src/app/models/settings.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  settings: Settings = {
    startingPeriodLength: 10,
    startingSessionLength: 10,
  };

  constructor(
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.settingsService.settingsChanges.subscribe(update => this.settings = update);
  }
}
