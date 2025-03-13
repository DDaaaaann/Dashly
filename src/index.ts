// src/index.ts
import log from './logger/logger';
import {loadConfig} from './config/config';
import {registerPartials} from './template/partials';
import {generateHtml} from './template/template';
import {registerHelpers} from './scripts/helpers';

export async function runDashboardGenerator() {
  const config = await loadConfig();
  registerPartials(config.theme);
  registerHelpers();
  generateHtml(config);

  log.success('Dashboard generated successfully.');
}

// CLI entrypoint
if (require.main === module) {
  runDashboardGenerator()
  .catch(error => {
    log.error("An error occurred while generating your dashboard:", error);
    process.exit(1);  // Only the CLI cares about exiting
  });
}
