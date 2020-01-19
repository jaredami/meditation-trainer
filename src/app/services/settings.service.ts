import { Injectable } from '@angular/core';
import { Action, AngularFirestore, DocumentSnapshot } from '@angular/fire/firestore';
import { firestore } from 'firebase';
import { BehaviorSubject, Observable } from 'rxjs';
import { Settings } from '../models/settings.model';

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

  getSettings(): Observable<Action<DocumentSnapshot<{}>>> {
    return this.afs.doc('users/user1').snapshotChanges();
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
