export interface FirestoreImport {
  __collections: FirestoreDocument;
}

type FirestoreDocument = {
  [key: string]: FirestoreDataType | Record<string, FirestoreDataType | any>;
};

type FirestoreDataType = {
  [K in keyof FirestoreDataTypes]: {
    __datatype__: K;
    value: FirestoreDataTypes[K];
  };
};

interface FirestoreDataTypes {
  timestamp: {
    _seconds: number;
    _nanoseconds: number;
  };
  documentReference: string;
  geopoint: {
    _latitude: number;
    _longitude: number;
  };
}
