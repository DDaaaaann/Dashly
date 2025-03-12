import fs from 'fs-extra';
import yaml from 'yaml';
import Ajv, {ValidateFunction} from 'ajv';
import * as handlebars from "handlebars";
import path from "path";
import {DashboardConfig} from "./src/scripts/interface";

import getMeta from "./src/scripts/meta";
import {registerPartials} from "./src/scripts/partials";
import {registerHelpers} from "./src/scripts/helpers";
import Logger from "./src/scripts/logger";

const log = new Logger({
  verbose: true,
});

const CONFIG_PATH = './config.yaml';
const SCHEMA_PATH = './src/schema.json';
const TEMPLATE_PATH = path.resolve("src", "partials", "template.hbs");
const OUTPUT_PATH = './dist/index.html';

async function runDashboardGenerator() {
  try {
    const config = await loadConfig();
    const theme = getTheme(config);

    await registerPartials(theme);
    await registerHelpers();

    generateHtml(config);
  } catch (error) {
    log.error("Fatal error occurred:", error);
    process.exit(1);
  }
}

/**
 * Generates HTML from the template and writes it to the output file.
 */
function generateHtml(config: DashboardConfig): void {
  try {
    const template = compileTemplate();
    const html = template(config);
    fs.outputFileSync(OUTPUT_PATH, html);
    log.success(`HTML page generated successfully at ${OUTPUT_PATH}`);
  } catch (error) {
    log.error("Failed to generate HTML:", error);
  }
}

/**
 * Reads and compiles the Handlebars template.
 */
function compileTemplate(): HandlebarsTemplateDelegate {
  return handlebars.compile(readFile(TEMPLATE_PATH, "Handlebars template"));
}

/**
 * Loads configuration from YAML, enriches it with CSS, JS, and metadata.
 */
async function loadConfig(): Promise<DashboardConfig> {
  const config: DashboardConfig = yaml.parse(readFile(CONFIG_PATH, "configuration file"));
  const theme = getTheme(config);

  validateConfig(config);

  return {
    ...config,
    inlineCss: readFile(`./assets/styles/${theme}.css`, "CSS file"),
    clockJs: readFile('./assets/js/clock.js', "Clock JS"),
    searchJs: readFile('./assets/js/search.js', "Search JS"),
    meta: getMeta(),
  };
}

/**
 * Extracts and normalizes the theme name.
 */
function getTheme(config: DashboardConfig): string {
  return (config.theme || "Night Owl").replace(/\s+/g, "_").toLowerCase();
}

/**
 * Validates the configuration against the JSON schema.
 */
function validateConfig(config: DashboardConfig): void {
  const schema = JSON.parse(readFile(SCHEMA_PATH, "JSON schema"));
  const ajv = new Ajv();
  const validate: ValidateFunction = ajv.compile(schema);

  if (!validate(config)) {
    throw new Error(`Configuration validation failed: ${JSON.stringify(validate.errors, null, 2)}`);
  }
}

/**
 * Reads a file and returns its content. Throws an error if the file is missing.
 */
function readFile(filePath: string, fileDescription: string = "file"): string {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error: unknown) {
    throw new Error(`Failed to read ${fileDescription} at ${filePath}: ${getErrorMessage(error)}`);
  }
}

/**
 * Extracts a safe error message from unknown errors.
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

// Call the main function to run the generator
runDashboardGenerator().catch(error => {
  log.error("An error occurred while running the dashboard generator:", error);
  process.exit(1);
});
