export type CommandLine<T> = T & {
  _: string[]
  version: boolean
  projectId: string
}

export type FirestoreImportCommands = {
  help: boolean
  serviceAccount: string
  path: string
  emulators: string
}

export type FirestoreExportCommands = {
  help: boolean
  serviceAccount: string
  path: string
  emulators: string
}

export type StorageExportCommands = {
  help: boolean
  serviceAccount: string
  path: string
  emulators: string
  storageBucket: string
  dest: string
}

export type StorageImportCommands = {
  help: boolean
  serviceAccount: string
  path: string
  emulators: string
  storageBucket: string
}
