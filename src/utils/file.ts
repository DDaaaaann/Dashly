import fs from 'fs-extra';
import { getErrorMessage } from './error';
import log from "../logger/logger";
import path from "path";

export function readFile(basePath: string, filePath: string, fileDescription = 'file'): string {
  log.debug(`Reading ${filePath}`)
  const absolutePath = path.join(basePath, filePath);
  try {
    return fs.readFileSync(absolutePath, 'utf8');
  } catch (error: unknown) {
    throw new Error(`Failed to read ${fileDescription} at ${absolutePath}: ${getErrorMessage(error)}`);
  }
}