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

  periodEndSoundOptions: { value: string, label: string }[] = [
    { value: 'assets/sounds/kyoto.mp3', label: 'Kyoto'},
    { value: 'assets/sounds/hand_bells.mp3', label: 'Hand Bells'},
    { value: 'assets/sounds/candle_damper.mp3', label: 'Candle Damper'},
  ];
  periodEndSoundSrc: string;
  sessionEndSoundOptions: { value: string, label: string }[] = [
    { value: 'assets/sounds/bowl_bell.mp3', label: 'Bowl Bell'},
    { value: 'assets/sounds/gong_1.mp3', label: 'Gong 1'},
    { value: 'assets/sounds/gong_2.mp3', label: 'Gong 2'},
    { value: 'assets/sounds/gong_3.mp3', label: 'Gong 3'},
  ];
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
