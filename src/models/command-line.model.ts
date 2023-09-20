export type CommandLine<T> = T & { _: string[]; version: boolean }

export type FirestoreImportCommands = {
  help: boolean
  serviceAccount: string
  path: string
  emulators: number
}

export type FirestoreExportCommands = {
  help: boolean
  serviceAccount: string
  path: string
  emulators: number
}

export type StorageExportCommands = {
  help: boolean
  serviceAccount: string
  path: string
  emulators: number
}
