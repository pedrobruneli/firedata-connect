import chalk from "chalk";
import { FirestoreImportCommands } from "../../models/command-line.model.js";
import { parseCommandLine } from "../command-line.js";
import { log } from "console";
import fs from "fs";
import { throwError } from "../error-handling/error-handler.js";
import { FirestoreImport } from "../../models/firestore-import.model.js";
import { isJson } from "../../utils/file.utils.js";
import { initializeFirebase } from "../start-firebase.js";

const importData = async (path: string, serviceAccount?: string) => {
  if (!isJson(path)) throwError("File must be a json file");
  const file = fs.readFileSync(path, "utf8");
  const data: FirestoreImport = JSON.parse(file);
  if (!data.__collections) throwError("Invalid json file");
  const collections = Object.keys(data.__collections);
  if (!collections.length) throwError("No collections found");
   initializeFirebase(serviceAccount)
};

const handleHelp = () => {
  log(chalk.cyanBright("Usage"));
  log(
    chalk.cyanBright(
      "$ firedata-import firestore --serviceAccount serviceAccount.json --path path/to/data",
    ),
  );
  log(
    chalk.cyanBright(
      "$ firedata-import firestore -a serviceAccount.json -p path/to/data",
    ),
  );
  log(chalk.cyanBright("$ firedata-import firestore --help"));
  log(chalk.cyanBright("$ firedata-import firestore -h"));
  log(chalk.cyanBright("$ firedata-import firestore --version"));
  log(chalk.cyanBright("$ firedata-import firestore -v"));
  process.exit(0);
};

const handleCommands = async (commands: Partial<FirestoreImportCommands>) => {
  if (commands.help || commands.h) {
    handleHelp();
    process.exit(0);
  }

  if (commands.version || commands.v) {
    const version = JSON.parse(fs.readFileSync("package.json", "utf8")).version;
    log(chalk.cyanBright("firedata-import version", version));
    process.exit(0);
  }

  if (!commands.p && !commands.path) {
    log(chalk.redBright("Path is required"));
    process.exit(1);
  }

  const path = commands.p || commands.path;

  if (!path || !fs.existsSync(path)) {
    log(chalk.redBright("Path does not exist"));
    process.exit(1);
  }

  const serviceAccount = commands.a || commands.serviceAccount;

  await importData(path, serviceAccount);
};

export const firestoreImportStart = async () => {
  const args = process.argv.slice(3);
  if (!args.length) handleHelp();
  const commands = parseCommandLine<FirestoreImportCommands>(args);
  await handleCommands(commands);

};
