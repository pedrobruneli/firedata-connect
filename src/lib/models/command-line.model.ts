export type CommandLine<T> = T & {
  _: string[]
  version: boolean
  projectId: string
  y: boolean
}

type BaseCommands = {
  help: boolean
  serviceAccount: string
  path: string
  emulators: string
}

export type FirestoreImportCommands = BaseCommands & {}

export type FirestoreExportCommands = BaseCommands & {}

export type StorageExportCommands = BaseCommands & {
  bucket: string
  dest: string
}

export type StorageImportCommands = BaseCommands & {
  bucket: string
}
