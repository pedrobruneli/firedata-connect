#!/usr/bin/env node
import { throwError } from '../lib/error-handling/error-handler.js'
import { firestoreExportStart } from '../lib/firestore/firestore-export.js'
import { storageExportStart } from '../lib/storage/storage-export.js'
import { catchVersion } from '../utils/project.utils.js'

const start = async () => {
  catchVersion()
  const type = process.argv.slice(2)[0]
  if (!type) throwError('No command provided')
  if (type === 'firestore') {
    await firestoreExportStart()
    process.exit(0)
  }
  if (type === 'storage') {
    await storageExportStart()
    process.exit(0)
  }
  throwError('Invalid command')
}
start()

export default start
