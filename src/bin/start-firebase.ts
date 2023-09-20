import { initializeApp } from 'firebase-admin/app'
import { throwError } from './error-handling/error-handler.js'
import chalk from 'chalk'
import { isJson } from '../utils/file.utils.js'
import { log } from 'console'

import * as fs from 'fs'
import admin from 'firebase-admin'

export const initializeFirebase = async (
  emulators: number,
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
  process.env['FIRESTORE_EMULATOR_HOST'] = `localhost:${emulators}`
  const app = initializeApp()
  log(
    chalk.yellow(
      'Dont forget to set FIRESTORE_EMULATOR_HOST variable to use emulators!'
    )
  )
  return app
}
