import admin from 'firebase-admin'
import { Primitive, Timestamp } from 'firebase-admin/firestore'

export interface FirestoreData {
  __collections: FirestoreDocument
}

type FirestoreDocument = {
  [key: string]: {
    [key: string]: FirestoreDocumentValue
  }
}

export type FirestoreDocumentValue =
  | FirestoreDataType<FirestoreDataTypes>
  | {
      [key: string]: FirestoreDocumentValue
    }
  | Primitive

type FirestoreDataType<T> = {
  [K in keyof T]: { __datatype__: K; value: T[K] }
}[keyof T]

interface FirestoreDataTypes {
  timestamp: {
    _seconds: number
    _nanoseconds: number
  }
  reference: string
  geopoint: {
    _latitude: number
    _longitude: number
  }
}

export const firestoreDataTypeMapper = {
  timestamp: (seconds: number, nanoseconds: number) =>
    new Timestamp(seconds, nanoseconds),
  reference: (path: string) => admin.firestore().doc(path),
  geopoint: (latitude: number, longitude: number) =>
    new admin.firestore.GeoPoint(latitude, longitude),
}
