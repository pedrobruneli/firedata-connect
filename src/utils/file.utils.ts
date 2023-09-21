import * as fs from 'fs'

export const isJson = (path: string) => {
  return path.split('.').pop() === 'json'
}

export const createFolderIfDontExists = (path: string): string => {
  const formattedPath = path.replace(/\\/g, '/')
  const paths = formattedPath.split('/')
  if (paths[paths.length - 1].includes('.')) {
    const destination = paths.slice(0, paths.length - 1).join('/')
    if (destination)
      fs.mkdirSync(destination, {
        recursive: true,
      })
    return destination
  }
  fs.mkdirSync(formattedPath, { recursive: true })
  return formattedPath
}
