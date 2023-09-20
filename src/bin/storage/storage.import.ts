import chalk from 'chalk'
import { log } from 'console'
import { StorageExportCommands } from '../../models/command-line.model.js'
import { parseCommandLine } from '../command-line.js'

const startExport = async (commands: StorageExportCommands) => {}

const handleHelp = () => {
  log(chalk.cyanBright('firedata-export storage'))
  log(chalk.cyanBright('  --path <path>'))
  log(chalk.cyanBright('  --serviceAccount <path>'))
  log(chalk.cyanBright('  --emulators <port> -- default 9199'))
  log(chalk.cyanBright('  --help'))
  process.exit(0)
}

const handleCommands = async (commands: StorageExportCommands) => {
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
  const commands = parseCommandLine<StorageExportCommands>(args)
  await handleCommands(commands)
}
