import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Settings } from 'src/app/models/settings.model';
import { SettingsService } from 'src/app/services/settings.service';

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

  ngOnInit(): void {
    this.settingsService.settingsChanges.subscribe((update: Settings) => this.settings = update);
  }

  incrementSetting(setting: string, increase: boolean): void {
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

  updatePeriodEndSound(newSrc: string): void {
    this.periodEndSoundSrc = newSrc;
    this.playPeriodEndSound();
    this.settingsService.setSettings({
      periodEndSoundSrc: this.periodEndSoundSrc
    });
  }

  updateSessionEndSound(newSrc: string): void {
    this.sessionEndSoundSrc = newSrc;
    this.playSessionEndSound();
    this.settingsService.setSettings({
      sessionEndSoundSrc: newSrc
    });
  }

  private playPeriodEndSound(): void {
    this.periodAudioRef.nativeElement.load();
    this.periodAudioRef.nativeElement.play();
  }

  private playSessionEndSound(): void {
    this.sessionAudioRef.nativeElement.load();
    this.sessionAudioRef.nativeElement.play();
  }
}
