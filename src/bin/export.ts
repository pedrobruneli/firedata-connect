import { catchVersion } from '../utils/project.utils.js'
import { throwError } from './error-handling/error-handler.js'
import { firestoreExportStart } from './firestore/firestore-export.js'
import { storageExportStart } from './storage/storage-export.js'

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
