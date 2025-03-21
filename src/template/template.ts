import fs from 'fs-extra';
import * as handlebars from 'handlebars';
import {DashboardConfig} from '../scripts/interface';
import {readFile} from '../utils/file';
import log from "../logger/logger";

const OUTPUT_PATH = './dist/index.html';
const TEMPLATE_PATH = './src/partials/template.hbs';

export function generateHtml(config: DashboardConfig): void {
  log.info("Generating dashboard...")
  try {
    const template = compileTemplate();
    const html = template(config);
    fs.outputFileSync(OUTPUT_PATH, html);
    log.info(`Dashboard available at ${OUTPUT_PATH}`);
  } catch (error) {
    log.error('Failed to generate HTML:', error);
  }
}

export function compileTemplate(): HandlebarsTemplateDelegate {
  log.info('Compiling template...');
  const templateString = readFile(TEMPLATE_PATH, 'Handlebars template');
  return handlebars.compile(templateString);
}