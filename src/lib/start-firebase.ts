import { initializeApp } from 'firebase-admin/app'
import { throwError } from './error-handling/error-handler.js'
import chalk from 'chalk'
import { isJson } from '../utils/file.utils.js'
import { log } from 'console'

import * as fs from 'fs'
import admin from 'firebase-admin'

const appConfigs = {
  firestore: (emulators: string) => {
    process.env['FIRESTORE_EMULATOR_HOST'] = `${emulators}`
    const app = initializeApp()
    log(chalk.yellow('FIRESTORE_EMULATOR_HOST set to', emulators))
    return app
  },
  storage: (emulators: string, storageBucket: string, projectId?: string) => {
    if (!projectId) throwError('Project id is required')
    process.env['FIREBASE_STORAGE_EMULATOR_HOST'] = `${emulators}`
    const app = initializeApp({
      storageBucket,
      projectId,
    })
    log(chalk.yellow('FIREBASE_STORAGE_EMULATOR_HOST set to', emulators))
    return app
  },
}

export const initializeStorage = async (
  projectId: string,
  emulators: string,
  storageBucket: string,
  serviceAccount?: string
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
      storageBucket,
    })
    return app
  }
  return appConfigs.storage(emulators, storageBucket, projectId)
}

export const initializeFirestore = async (
  emulators: string,
  serviceAccount?: string
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
    })
    return app
  }
  return appConfigs.firestore(emulators)
}
