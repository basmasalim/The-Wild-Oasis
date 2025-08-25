import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { collection, collectionData, deleteDoc, doc, docData, Firestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class Cabins {
    constructor(private http: HttpClient) { }

    private firestore = inject(Firestore);
    private cloudName = 'djnnfcfoe';
    private uploadPreset = 'unsigned_preset';

    getCabins(): Observable<any[]> {
        const cabinsRef = collection(this.firestore, 'cabins');
        return collectionData(cabinsRef, { idField: 'id' }) as Observable<any[]>;
    }


    deleteCabin(cabinId: string | undefined): Observable<void> {
        if (!cabinId) throw new Error("Cabin id is missing");
        const cabinRef = doc(this.firestore, `cabins/${cabinId}`);
        return from(deleteDoc(cabinRef));
    }

    uploadImage(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', this.uploadPreset);

        return this.http.post(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, formData);
    }

}
