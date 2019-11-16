import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { Settings } from 'src/app/models/settings.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  settings: Settings;

  constructor(
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.settingsService.settingsChanges.subscribe(update => this.settings = update);
  }

  increasePeriodLength() {
    this.settingsService.setSettings({
      startingPeriodLength: this.settings.startingPeriodLength + 1
    });
  }

  decreasePeriodLength() {
    this.settingsService.setSettings({
      startingPeriodLength: this.settings.startingPeriodLength - 1
    });
  }

  increaseSessionLength() {
    this.settingsService.setSettings({
      startingSessionLength: this.settings.startingSessionLength + 1
    });
  }

  decreaseSessionLength() {
    this.settingsService.setSettings({
      startingSessionLength: this.settings.startingSessionLength - 1
    });
  }
}
