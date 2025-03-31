import fs from 'fs-extra';
import * as handlebars from 'handlebars';
import {DashboardConfig} from '../scripts/interface';
import {readFile} from '../utils/file';
import log from "../logger/logger";

const TEMPLATE_PATH = '../partials/template.hbs';

export function generateHtml(config: DashboardConfig): void {
  const OUTPUT_PATH = process.env.OUTPUT_PATH || './index.html';
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
  const templateString = readFile(__dirname, TEMPLATE_PATH, 'Handlebars template');
  return handlebars.compile(templateString);
}