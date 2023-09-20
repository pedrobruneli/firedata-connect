import chalk from 'chalk'
import { log } from 'console'
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
