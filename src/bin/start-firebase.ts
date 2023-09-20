import { initializeApp } from 'firebase-admin/app'
import { throwError } from './error-handling/error-handler.js'
import chalk from 'chalk'
import { isJson } from '../utils/file.utils.js'
import { log } from 'console'

import * as fs from 'fs'
import admin from 'firebase-admin'

export const initializeFirebase = async (
  projectId: string,
  emulators: string,
  serviceAccount?: string,
  type?: 'firestore' | 'storage'
) => {
  if (serviceAccount) {
    if (!isJson(serviceAccount))
      throwError('Service account must be a json file')
    const serviceAccountData = JSON.parse(
      fs.readFileSync(serviceAccount, 'utf-8')
    )
    const app = initializeApp({
      credential: admin.credential.cert(serviceAccountData),
      projectId: serviceAccountData.project_id,
      storageBucket: `${projectId}.appspot.com`,
    })
    return app
  }
  if (type === 'firestore') {
    process.env['FIRESTORE_EMULATOR_HOST'] = `${emulators}`
    const app = initializeApp()
    log(chalk.yellow('FIRESTORE_EMULATOR_HOST set to', emulators))
    return app
  }
  if (!projectId) throwError('Project id is required')
  process.env['FIREBASE_STORAGE_EMULATOR_HOST'] = `${emulators}`
  const app = initializeApp({
    storageBucket: `${projectId}.appspot.com`,
    projectId,
  })
  log(chalk.yellow('FIREBASE_STORAGE_EMULATOR_HOST set to', emulators))
  return app
}
