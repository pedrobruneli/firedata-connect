import {
  CommandLine,
  FirestoreExportCommands,
} from '../../models/command-line.model.js'
import { FirestoreData } from '../../models/firestore.model.js'
import { parseCommandLine } from '../command-line.js'
import chalk from 'chalk'
import { log } from 'console'
import admin from 'firebase-admin'
import { initializeFirebase } from '../start-firebase.js'
import * as fs from 'fs'

const treatFirebaseDatatype = (data: any): any => {
  if (!data) return data
  if (data instanceof admin.firestore.Timestamp) {
    return {
      __datatype__: 'timestamp',
      value: {
        seconds: data.seconds,
        nanoseconds: data.nanoseconds,
      },
    }
  }
  if (data instanceof admin.firestore.GeoPoint) {
    return {
      __datatype__: 'geopoint',
      value: {
        latitude: data.latitude,
        longitude: data.longitude,
      },
    }
  }
  if (data instanceof admin.firestore.DocumentReference) {
    return {
      __datatype__: 'reference',
      value: {
        path: data.path,
      },
    }
  }
  if (typeof data === 'object') {
    return Object.keys(data).reduce((acc, key) => {
      return {
        ...acc,
        [key]: treatFirebaseDatatype(data[key]),
      }
    }, {})
  }
  return data
}

const getFirestoreJsonData = async (): Promise<FirestoreData> => {
  const collections = await admin.firestore().listCollections()
  const data = await collections.reduce(
    async (acc, collection) => {
      const docs = await collection.listDocuments()
      const docsData = await docs.reduce(async (acc, doc) => {
        const docData = await doc.get()
        return {
          ...(await acc),
          [doc.id]: treatFirebaseDatatype(docData.data()),
        }
      }, Promise.resolve({}))
      return {
        __collections: {
          ...(await acc).__collections,
          [collection.id]: docsData,
        },
      }
    },
    Promise.resolve({
      __collections: {},
    })
  )
  return data
}

const startExport = async (commands: CommandLine<FirestoreExportCommands>) => {
  initializeFirebase(
    commands.projectId,
    commands.emulators || '127.0.0.1:8085',
    commands.serviceAccount,
    'firestore'
  )
  const data = await getFirestoreJsonData()
  const paths = commands.path.split('/')
  if (paths[paths.length - 1].includes('.')) {
    fs.mkdirSync(paths.slice(0, paths.length - 1).join('/'), {
      recursive: true,
    })
    fs.writeFileSync(commands.path, JSON.stringify(data))
    chalk.greenBright('Data exported successfully')
    process.exit(0)
  }
  fs.mkdirSync(commands.path, { recursive: true })
  fs.writeFileSync(commands.path + '/firestore.json', JSON.stringify(data))
}

const handleHelp = () => {
  log(chalk.cyanBright('firedata-export firestore'))
  log(chalk.cyanBright('  --path <path>'))
  log(chalk.cyanBright('  --serviceAccount <path>'))
  log(chalk.cyanBright('  --emulators <firestore port> -- default 8085'))
  log(chalk.cyanBright('  --help'))
  process.exit(0)
}

const handleCommands = async (
  commands: CommandLine<FirestoreExportCommands>
) => {
  if (commands.help) handleHelp()
  if (!commands.path) {
    log(chalk.redBright('Path is required'))
    process.exit(1)
  }
  await startExport(commands)
}

export const firestoreExportStart = async () => {
  const args = process.argv.slice(3)
  if (!args.length) handleHelp()
  const commands = parseCommandLine<FirestoreExportCommands>(args)
  await handleCommands(commands)
}
