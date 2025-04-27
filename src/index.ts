#!/usr/bin/env node
import {loadConfig} from './config/config';
import {registerPartials} from './template/partials';
import {generateHtml} from './template/template';
import {registerHelpers} from './scripts/helpers';
import {parseArgs} from "./utils/args";
import log from './logger/logger';

export async function runDashboardGenerator() {
  const config = await loadConfig();
  registerPartials(config.theme);
  registerHelpers();
  generateLookupTable(config);
  generateHtml(config);

  log.success(`Dashboard generated successfully.`);
}

if (require.main === module) {
  log.debug('Current working dir:', process.cwd());
  log.debug('__dirname:', __dirname);

  parseArgs();

  runDashboardGenerator()
  .catch(error => {
    log.error("An error occurred while generating your dashboard:", error);
    process.exit(1);
  });
}
