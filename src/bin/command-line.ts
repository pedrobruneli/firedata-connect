import { CommandLine } from "../models/command-line.model.js";

export const parseCommandLine = <T>(args: string[]): CommandLine<T> => {
  const result: CommandLine<T> = { _: [], version: false, ...{} as T };
  for (let i = 0; i !== args.length; i++) {
    if (!args[i]) continue;
    if (args[i].startsWith("--")) {
      const key = args[i].replace("--", "");
      const value =
        args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : true;
      result[key] = value;
    } else {
      result._.push(args[i]);
    }
  }
  return result;
};
