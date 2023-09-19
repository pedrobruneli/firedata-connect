import chalk from "chalk";
import { log } from "console";

export const throwError = (message: string) => {
  log(chalk.red(message));
  process.exit(1);
};
