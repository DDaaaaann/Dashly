import fs from 'fs-extra';
import {getErrorMessage} from './error';
import log from "../logger/logger";

export function readFile(filePath: string, fileDescription = 'file'): string {
  log.debug(`Reading ${filePath}`)
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error: unknown) {
    throw new Error(`Failed to read ${fileDescription} at ${filePath}: ${getErrorMessage(error)}`);
  }
}