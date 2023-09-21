import chalk from 'chalk'
import { parseCommandLine } from '../command-line.js'
import { log } from 'console'
import {
  CommandLine,
  StorageImportCommands,
} from '../models/command-line.model.js'
import { displayImportAlert } from '../../utils/project.utils.js'
import { initializeStorage } from '../start-firebase.js'
import * as fs from 'fs'
import admin from 'firebase-admin'

const uploadFiles = async (path: string) => {
  log(chalk.greenBright('Importing storage...'))
  const bucket = admin.storage().bucket()
  const files = fs.readdirSync(path, { recursive: true, withFileTypes: true })
  for (const file of files) {
    if (!file.name) return
    const filePath = `${file.path}${file.name}`
    await bucket.upload(filePath, { destination: filePath })
  }
}

const startImport = async (commands: CommandLine<StorageImportCommands>) => {
  const app = await initializeStorage(
    commands.projectId,
    commands.emulators || '127.0.0.1:9199',
    commands.bucket,
    commands.serviceAccount
  )
  await displayImportAlert(app, commands.serviceAccount)
  await uploadFiles(commands.path)
  log(chalk.greenBright('Storage imported successfully'))
}

const handleHelp = () => {
  log(chalk.cyanBright('firedata-export storage'))
  log(chalk.cyanBright('  --path <path to files/folders>'))
  log(chalk.cyanBright('  --serviceAccount <path>'))
  log(chalk.cyanBright('  --emulators <port> -- default 9199'))
  log(chalk.cyanBright('  --help'))
  process.exit(0)
}

const handleCommands = async (commands: CommandLine<StorageImportCommands>) => {
  if (commands.help) handleHelp()
  if (!commands.path) {
    log(chalk.redBright('Path is required'))
    process.exit(1)
  }
  if (!commands.bucket) {
    log(chalk.redBright('Storage bucket is required'))
    process.exit(1)
  }
  await startImport(commands)
}

export const storageImportStart = async () => {
  const args = process.argv.slice(3)
  if (!args.length) handleHelp()
  const commands = parseCommandLine<StorageImportCommands>(args)
  await handleCommands(commands)
}
