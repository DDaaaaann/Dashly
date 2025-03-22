import yaml from 'yaml';
import Ajv, {ValidateFunction} from 'ajv';
import {DashboardConfig} from '../scripts/interface';
import getMeta from '../scripts/meta';

import log from "../logger/logger";
import {readFile} from "../utils/file";
import schema from "../schema.json";

const CONFIG_PATH = './config.yaml';

export async function loadConfig(): Promise<DashboardConfig> {
  log.info('Loading configuration...');

  const config: DashboardConfig = yaml.parse(readFile(process.cwd(), CONFIG_PATH, 'configuration file'));
  const theme = getTheme(config);

  validateConfig(config);

  return {
    ...config,
    theme: config.theme || 'Night Owl',
    inlineCss: readFile(__dirname, `../../assets/styles/${theme}.css`, 'CSS file'),
    clockJs: readFile(__dirname, '../../assets/js/clock.js', 'Clock JS'),
    searchJs: readFile(__dirname, '../../assets/js/search.js', 'Search JS'),
    meta: getMeta(),
  };
}

function validateConfig(config: DashboardConfig): void {
  log.debug('Validating configuration...');
  const ajv = new Ajv();
  const validate: ValidateFunction = ajv.compile(schema);

  if (!validate(config)) {
    throw new Error(`Configuration validation failed: ${JSON.stringify(validate.errors, null, 2)}`);
  }
  log.debug('Configuration validated!');
}

function getTheme(config: DashboardConfig): string {
  if (!config.theme) {
    log.debug("Using default theme")
  }
  return (config.theme || 'Night Owl').replace(/\s+/g, '_').toLowerCase();
}

// Exported for testing purposes
export {validateConfig, getTheme};