import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private increment: firestore.FieldValue = firestore.FieldValue.increment(1);
  private decrement: firestore.FieldValue = firestore.FieldValue.increment(-1);

  constructor(
    private afs: AngularFirestore
  ) {}

  setSettings(settingName: string, settingValue: any): void {
    const settingsUpdate: { [k: string]: any } = {};
    settingsUpdate[`settings.${settingName}`] = settingValue;

    this.afs.doc('users/user1').update(settingsUpdate);
  }

  incrementSetting(settingName: string): void {
    const settingsUpdate: { [k: string]: firestore.FieldValue } = {};
    settingsUpdate[`settings.${settingName}`] = this.increment;

    this.afs.doc('users/user1').update(settingsUpdate);
  }

  decrementSetting(settingName: string): void {
    const settingsUpdate: { [k: string]: firestore.FieldValue } = {};
    settingsUpdate[`settings.${settingName}`] = this.decrement;

    this.afs.doc('users/user1').update(settingsUpdate);
  }
}
