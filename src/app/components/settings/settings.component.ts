import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { Settings } from 'src/app/models/settings.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  settings: Settings;

  periodEndSoundSrc: string;
  sessionEndSoundSrc: string;

  @ViewChild('periodAudio') periodAudioRef: ElementRef;
  @ViewChild('sessionAudio') sessionAudioRef: ElementRef;

  constructor(
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.settingsService.settingsChanges.subscribe(update => this.settings = update);
  }

  incrementSetting(setting: string, increase: boolean) {
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

  updatePeriodEndSound(newSrc) {
    this.periodEndSoundSrc = newSrc;
    this.playPeriodEndSound();
    this.settingsService.setSettings({
      periodEndSoundSrc: this.periodEndSoundSrc
    });
  }

  updateSessionEndSound(newSrc) {
    this.sessionEndSoundSrc = newSrc;
    this.playSessionEndSound();
    this.settingsService.setSettings({
      sessionEndSoundSrc: newSrc
    });
  }

  private playPeriodEndSound() {
    this.periodAudioRef.nativeElement.load();
    this.periodAudioRef.nativeElement.play();
  }

  private playSessionEndSound() {
    this.sessionAudioRef.nativeElement.load();
    this.sessionAudioRef.nativeElement.play();
  }
}
