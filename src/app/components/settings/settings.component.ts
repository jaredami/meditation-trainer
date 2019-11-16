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

  updateSettings(setting: string, increase: boolean) {
    if (increase) {
      this.settingsService.setSettings({
        [setting]: this.settings[setting] + 1
      });
    } else {
      this.settingsService.setSettings({
        [setting]: this.settings[setting] - 1
      });
    }
  }
}
