import yaml from 'yaml';
import Ajv, {ValidateFunction} from 'ajv';
import {DashboardConfig} from '../scripts/interface';
import getMeta from '../scripts/meta';

import log from "../logger/logger";
import {readFile} from "../utils/file";

const CONFIG_PATH = './config.yaml';
const SCHEMA_PATH = './src/schema.json';

export async function loadConfig(): Promise<DashboardConfig> {
  log.info('Loading configuration...');
  log.debug(`Reading config from ${CONFIG_PATH}`)
  const config: DashboardConfig = yaml.parse(readFile(CONFIG_PATH, 'configuration file'));
  const theme = getTheme(config);

  validateConfig(config);

  return {
    ...config,
    inlineCss: readFile(`./assets/styles/${theme}.css`, 'CSS file'),
    clockJs: readFile('./assets/js/clock.js', 'Clock JS'),
    searchJs: readFile('./assets/js/search.js', 'Search JS'),
    meta: getMeta(),
  };
}

export function validateConfig(config: DashboardConfig): void {
  log.debug('Validating configuration...');
  const schema = JSON.parse(readFile(SCHEMA_PATH, 'JSON schema'));
  const ajv = new Ajv();
  const validate: ValidateFunction = ajv.compile(schema);

  if (!validate(config)) {
    throw new Error(`Configuration validation failed: ${JSON.stringify(validate.errors, null, 2)}`);
  }
  log.debug('Configuration validated!');
}

export function getTheme(config: DashboardConfig): string {
  if (!config.theme) {
    log.debug("Using default theme")
  }
  return (config.theme || 'Night Owl').replace(/\s+/g, '_').toLowerCase();
}