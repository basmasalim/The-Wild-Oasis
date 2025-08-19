import { inject, Injectable } from '@angular/core';
import { collection, collectionData, deleteDoc, doc, docData, Firestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class Cabins {
    private firestore = inject(Firestore);


    getCabins(): Observable<any[]> {
        const cabinsRef = collection(this.firestore, 'cabins');
        return collectionData(cabinsRef, { idField: 'id' }) as Observable<any[]>;
    }


    deleteCabin(cabinId: string | undefined): Observable<void> {
        if (!cabinId) throw new Error("Cabin id is missing");
        const cabinRef = doc(this.firestore, `cabins/${cabinId}`);
        return from(deleteDoc(cabinRef));
    }

}
