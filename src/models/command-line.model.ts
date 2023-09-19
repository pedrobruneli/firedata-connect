export interface CommandLine<T extends Partial<T>> {
  _: string[];
}

export interface FirestoreImportCommands {
  _: string[];
  help: boolean;
  h: boolean;
  version: boolean;
  v: boolean;
  serviceAccount: string;
  a: string;
  path: string;
  p: string;
}
