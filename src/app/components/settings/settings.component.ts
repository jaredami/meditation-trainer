import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Action, DocumentSnapshot } from '@angular/fire/firestore';
import { Settings } from 'src/app/models/settings.model';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  settings: Settings = {
    periodEndSoundSrc: 'assets/sounds/kyoto.mp3',
    sessionEndSoundSrc: 'assets/sounds/bowl_bell.mp3',
    startingPeriodLength: 10,
    startingSessionLength: 10,
  };

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
    this.settingsService.getSettings()
    .subscribe((actionArray: Action<DocumentSnapshot<{ settings: Settings }>>) => {
      this.settings = actionArray.payload.data().settings;
    });
  }

  updatePeriodEndSound(newSrc: string): void {
    this.periodEndSoundSrc = newSrc;
    this.playPeriodEndSound();
    this.settingsService.setSettings('periodEndSoundSrc', newSrc);
  }

  updateSessionEndSound(newSrc: string): void {
    this.sessionEndSoundSrc = newSrc;
    this.playSessionEndSound();
    this.settingsService.setSettings('sessionEndSoundSrc', newSrc);
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
