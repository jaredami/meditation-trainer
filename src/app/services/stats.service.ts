import { Injectable } from '@angular/core';
import { Action, AngularFirestore, DocumentSnapshot } from '@angular/fire/firestore';
import { firestore } from 'firebase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  // TODO: store date of the first login for this
  private dateStarted: number = 1576818000000;
  private today: number = Date.now();
  private increment: firestore.FieldValue = firestore.FieldValue.increment(1);

  constructor(
    private afs: AngularFirestore
  ) {
  }

  getStats(): Observable<Action<DocumentSnapshot<{}>>> {
    return this.afs.doc('users/user1').snapshotChanges();
  }

  addTotalSessionTime(): void {
    this.afs.doc('users/user1').update({ 'stats.totalSessionTime': this.increment });
  }

  addCompletedSession(): void {
    this.afs.doc('users/user1').update({ 'stats.completedSessions': this.increment });
  }

  checkForLongestPeriod(currentMaxPeriodLength: number): void {
    this.afs.doc('users/user1').ref.get().then((doc: firestore.DocumentSnapshot) => {
      const data: firestore.DocumentData = doc.data();
      if (data.stats.longestPeriod < currentMaxPeriodLength) {
        this.afs.doc('users/user1').update({ 'stats.longestPeriod': currentMaxPeriodLength });
      }
    });
  }

  checkForLongestSessionCompleted(currentSessionLength: number): void {
    this.afs.doc('users/user1').ref.get().then((doc: firestore.DocumentSnapshot) => {
      const data: firestore.DocumentData = doc.data();
      if (data.stats.longestSession < currentSessionLength) {
        this.afs.doc('users/user1').update({ 'stats.longestSession': currentSessionLength });
      }
    });
  }

  setAverageMinutesPerDay(): void {
    let totalSessionTime: number;
    this.afs.doc('users/user1').ref.get().then((doc: firestore.DocumentSnapshot) => {
      totalSessionTime = doc.data().stats.totalSessionTime;
      const dateDiff: number = Math.round((this.today - this.dateStarted) / (1000 * 60 * 60 * 24));
      const average: number = Math.round(totalSessionTime / dateDiff);
      this.afs.doc('users/user1').update({ 'stats.averageSessionTime': average });
    });
  }
}
