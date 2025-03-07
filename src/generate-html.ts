import fs from 'fs-extra';
import yaml from 'yaml';
import Ajv, {ValidateFunction} from 'ajv';
import * as handlebars from "handlebars";
import path from "path";
import {DashboardConfig} from "./scripts/interface";

import getMeta from "./scripts/meta";
import {registerPartials} from "./scripts/partials";
import {registerHelpers} from "./scripts/helpers";

// Define constants for file paths
const CONFIG_PATH = './config.yaml';
const SCHEMA_PATH = './src/schema.json';
const TEMPLATE_PATH = path.resolve("src", "partials", "template.hbs");
const OUTPUT_PATH = './dist/index.html';

try {
  const config = loadConfig();
  const theme = getTheme(config);

  registerPartials(theme);
  registerHelpers();

  generateHtml(config);
} catch (error) {
  logError("Fatal error occurred:", error);
  process.exit(1);
}

/**
 * Generates HTML from the template and writes it to the output file.
 */
function generateHtml(config: DashboardConfig): void {
  try {
    const template = compileTemplate();
    const html = template(config);
    fs.outputFileSync(OUTPUT_PATH, html);
    logSuccess(`HTML page generated successfully at ${OUTPUT_PATH}`);
  } catch (error) {
    logError("Failed to generate HTML:", error);
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
function loadConfig(): DashboardConfig {
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

/**
 * Logs a success message in green.
 */
function logSuccess(message: string): void {
  console.log(`\x1b[32m✓ ${message}\x1b[0m`); // Green text
}

/**
 * Logs an error message in red.
 */
function logError(message: string, error?: unknown): void {
  console.error(`\x1b[31m✗ ${message}\x1b[0m`, getErrorMessage(error));
}
