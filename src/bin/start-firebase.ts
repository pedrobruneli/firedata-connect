import { initializeApp } from "firebase-admin/app";
import { throwError } from "./error-handling/error-handler.js";
import chalk from "chalk";
import { isJson } from "../utils/file.utils.js";
import { log } from "console";

export const initializeFirebase = (serviceAccount?: string) => {
  if (serviceAccount) {
    if (!isJson(serviceAccount))
    throwError("Service account must be a json file");
  const app = initializeApp({
    credential: JSON.parse(serviceAccount),
  });
  return app;
}
  const app = initializeApp()
  log(chalk.yellow('Dont forget to set FIRESTORE_EMULATOR_HOST variable to use emulators!'))
  return app
};
