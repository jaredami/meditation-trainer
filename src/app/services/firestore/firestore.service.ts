import { Injectable } from '@angular/core';
import { Action, AngularFirestore, DocumentSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(
    private afs: AngularFirestore
  ) { }

  getUserDataSnapshot(): Observable<Action<DocumentSnapshot<{}>>> {
    return this.afs.doc('users/user1').snapshotChanges();
  }
}
