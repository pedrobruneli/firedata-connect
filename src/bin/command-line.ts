import { CommandLine } from '../models/command-line.model.js'

export const parseCommandLine = <T>(args: string[]): CommandLine<T> => {
  const result: CommandLine<T> = {
    _: [],
    version: false,
    ...({} as T),
    projectId: '',
  }
  return args.reduce((acc, arg, index) => {
    if (!arg) return acc
    if (arg.startsWith('--')) {
      const key = arg.replace('--', '')
      const value =
        args[index + 1] && !args[index + 1].startsWith('--')
          ? args[index + 1]
          : true
      return {
        ...acc,
        [key]: value,
      }
    }
    return {
      ...acc,
      _: [...acc._, arg],
    }
  }, result)
}
