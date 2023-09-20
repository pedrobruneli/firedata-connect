import chalk from 'chalk'
import { log } from 'console'
import {
  CommandLine,
  StorageExportCommands,
} from '../../models/command-line.model.js'
import { parseCommandLine } from '../command-line.js'
import { initializeFirebase } from '../start-firebase.js'
import admin from 'firebase-admin'
import path from 'path'
import { createFolderIfDontExists } from '../../utils/file.utils.js'

const getStorageFiles = async (
  commands: CommandLine<StorageExportCommands>
) => {
  const bucket = admin.storage().bucket()
  const destination = createFolderIfDontExists(commands.path)
  const [files] = await bucket.getFiles()
  for (const file of files) {
    const filePath = file.name
    const finalDestination = path.join(destination, filePath)
    console.log(finalDestination)
    await file.download({ destination: finalDestination })
  }
}

const startExport = async (commands: CommandLine<StorageExportCommands>) => {
  initializeFirebase(
    commands.projectId,
    commands.emulators || '127.0.0.1:9199',
    commands.serviceAccount
  )
  await getStorageFiles(commands)
  log(chalk.greenBright('Storage exported successfully'))
}

const handleHelp = () => {
  log(chalk.cyanBright('firedata-export storage'))
  log(chalk.cyanBright('  --path <destination>'))
  log(chalk.cyanBright('  --serviceAccount <path>'))
  log(chalk.cyanBright('  --emulators <port> -- default 9199'))
  log(chalk.cyanBright('  --help'))
  process.exit(0)
}

const handleCommands = async (commands: CommandLine<StorageExportCommands>) => {
  if (commands.help) handleHelp()
  if (!commands.path) {
    log(chalk.redBright('Path is required'))
    process.exit(1)
  }
  await startExport(commands)
}

export const storageExportStart = async () => {
  const args = process.argv.slice(3)
  if (!args.length) handleHelp()
  const commands = parseCommandLine<StorageExportCommands>(args)
  console.log(commands)
  await handleCommands(commands)
}
