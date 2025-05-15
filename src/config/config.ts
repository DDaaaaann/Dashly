import yaml from 'yaml';
import Ajv, { ValidateFunction } from 'ajv';
import { DashboardConfig } from '../scripts/interface';
import getMeta from '../scripts/meta';

import log from "../logger/logger";
import { readFile } from "../utils/file";
import schema from "../schema.json";
import { getClockJs, getIconJS, getInlineCss, getLinkJs, getLiveSearchJs, getSearchJs } from "../utils/paths";
import { generateLookupTable } from "../scripts/search";
import path from "path";

export async function loadConfig(): Promise<DashboardConfig> {
  log.info('Loading configuration...');
  const CONFIG_PATH = process.env.INPUT_PATH || './config.yaml';

  const configBasePath = path.dirname(CONFIG_PATH);
  const configFileName = path.basename(CONFIG_PATH);
  const config: DashboardConfig = yaml.parse(readFile(configBasePath, configFileName, 'configuration file'));

  // For theme Emerald Tides, set defaultTitle to true
  config.defaultTitle = config.theme == 'Emerald Tides';

  const theme = getTheme(config);

  validateConfig(config);

  return {
    ...config,
    theme: config.theme || 'Night Owl',
    meta: getMeta(),
    inlineCss: getInlineCss(theme),
    bundleJs: [
      getSearchJs(),
      getLinkJs(),
      getIconJS(),
      ...(config.clock ? [getClockJs()] : []),
      ...(config.liveSearch ? [getLiveSearchJs()] : []),
      ...(config.liveSearch ? [`const lookupTable = ${JSON.stringify(generateLookupTable(config))}`] : []),
    ].join('\n')
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