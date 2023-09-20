import chalk from 'chalk'
import {
  CommandLine,
  FirestoreImportCommands,
} from '../../models/command-line.model.js'
import { parseCommandLine } from '../command-line.js'
import { log } from 'console'
import * as fs from 'fs'
import { throwError } from '../error-handling/error-handler.js'
import {
  FirestoreDocumentValue,
  FirestoreData,
  firestoreDataTypeMapper,
} from '../../models/firestore.model.js'
import { isJson } from '../../utils/file.utils.js'
import { initializeFirebase } from '../start-firebase.js'
import admin from 'firebase-admin'
import type { WithFieldValue, DocumentData } from 'firebase-admin/firestore'
import type { App } from 'firebase-admin/app'

const readImportFile = (path: string): FirestoreData => {
  if (!isJson(path)) throwError('File must be a json file')
  const file = fs.readFileSync(path, 'utf8')
  const data: FirestoreData = JSON.parse(file)
  if (!data.__collections) throwError('Invalid json file')
  const collections = Object.keys(data.__collections)
  if (!collections.length) throwError('No collections found')
  return data
}

const convertFirestoreDocumentValues = (
  data: FirestoreDocumentValue
): admin.firestore.WithFieldValue<DocumentData> => {
  const keys = Object.keys(data)
  const convertedData: WithFieldValue<DocumentData> = keys.reduce(
    (acc, key) => {
      const value = data[key]
      if (value.__datatype__) {
        const datatype = value.__datatype__
        const val = value.value
        return {
          ...acc,
          [key]:
            firestoreDataTypeMapper[datatype](...Object.values(val)) || val,
        }
      }
      if (typeof value === 'object') {
        return {
          ...acc,
          [key]: convertFirestoreDocumentValues(value),
        }
      }
      return {
        ...acc,
        [key]: value,
      }
    },
    {}
  )
  return convertedData
}

const importDocument = async (
  docRef: FirebaseFirestore.DocumentReference,
  data: FirestoreDocumentValue
) => {
  const convertedObject = convertFirestoreDocumentValues(data)
  await docRef.set(convertedObject)
}

const importCollection = async (collection: string, data: FirestoreData) => {
  const collectionRef = admin.firestore().collection(collection)
  const documents = Object.keys(data.__collections[collection])
  for (const document of documents) {
    const docRef = collectionRef.doc(document)
    const docData = data.__collections[collection][document]
    await importDocument(docRef, docData)
  }
}

const displayImportAlert = async (app: App, serviceAccount?: string) => {
  serviceAccount &&
    log(chalk.yellow.bold('PROJECT ID:', app.options.projectId.toUpperCase()))
  log(
    chalk.red('You are about to import data to firestore to'),
    chalk.red.bold(serviceAccount ? 'PRODUCTION' : 'EMULATORS')
  )
  log(chalk.red('This will overwrite any existing data'))
  log(chalk.red('Are you sure you want to continue? (y/n)'))
  const answer = await new Promise((resolve) => {
    process.stdin.once('data', (data) => {
      resolve(data.toString().trim())
    })
  })
  if (answer !== 'y') {
    log(chalk.red('Aborting'))
    process.exit(0)
  }
}

const importData = async (commands: CommandLine<FirestoreImportCommands>) => {
  const data = readImportFile(commands.path)
  const app = await initializeFirebase(
    commands.projectId,
    commands.emulators || '127.0.0.1:8085',
    commands.serviceAccount,
    'firestore'
  )
  await displayImportAlert(app, commands.serviceAccount)
  const collections = Object.keys(data.__collections)
  for (const collection of collections) {
    await importCollection(collection, data)
  }
  log(chalk.greenBright('Data imported successfully'))
}

const handleHelp = () => {
  log(chalk.cyanBright('firedata-import firestore'))
  log(chalk.cyanBright('  --serviceAccount <path>'))
  log(chalk.cyanBright('  --path <path>'))
  log(chalk.cyanBright('  --emulators <firestore ip>'))
  log(chalk.cyanBright('  --help'))
  log(chalk.cyanBright('  --version'))

  process.exit(0)
}

const handleCommands = async (
  commands: CommandLine<FirestoreImportCommands>
) => {
  if (commands.help) {
    handleHelp()
    process.exit(0)
  }

  if (!commands.path) {
    log(chalk.redBright('Path is required'))
    process.exit(1)
  }

  const path = commands.path

  if (!fs.existsSync(path)) {
    log(chalk.redBright('Path does not exist'))
    process.exit(1)
  }

  await importData(commands)
}

export const firestoreImportStart = async () => {
  const args = process.argv.slice(3)
  if (!args.length) handleHelp()
  const commands = parseCommandLine<FirestoreImportCommands>(args)
  await handleCommands(commands)
}
