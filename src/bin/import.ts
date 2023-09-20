import { throwError } from './error-handling/error-handler.js'
import { firestoreImportStart } from './firestore/firestore-import.js'
import { catchVersion } from '../utils/project.utils.js'

const start = async () => {
  catchVersion()
  const type = process.argv.slice(2)[0]
  if (!type) throwError('No command provided')
  if (type === 'firestore') {
    await firestoreImportStart()
    process.exit(0)
  }
  if (type === 'storage') throw new Error('Not implemented yet')
  throwError('Invalid command')
}
start()
