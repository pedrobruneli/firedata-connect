import chalk from 'chalk'
import { log } from 'console'
import { App } from 'firebase-admin/app'
import * as fs from 'fs'

export const catchVersion = () => {
  if (!process.argv.slice(2).length) return
  const version = process.argv.slice(2)[0].includes('version')
  if (version) {
    const version = JSON.parse(fs.readFileSync('package.json', 'utf8')).version
    log(chalk.cyanBright('firedata-connect version', version))
    process.exit(0)
  }
}

export const displayImportAlert = async (app: App, serviceAccount?: string) => {
  serviceAccount &&
    log(chalk.yellow.bold('PROJECT ID:', app.options.projectId.toUpperCase()))
  log(
    chalk.red('You are about to import data to firebase to'),
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
