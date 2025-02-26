import fs from 'fs-extra';
import yaml from 'yaml';
import Ajv from 'ajv';
import * as handlebars from "handlebars";
import path from "path";
import {DashboardConfig} from "./scripts/interface";
import {setDashboard, setFooter, setHeader} from "./scripts/partial";
import getMeta from "./scripts/meta";

// Load and parse the YAML configuration
const configPath = './config.yaml';
const schemaPath = './schema.json';
const fileContent = fs.readFileSync(configPath, 'utf8');
const config: DashboardConfig = yaml.parse(fileContent);
const theme = (config.theme || "Night Owl").replaceAll(" ", "_").toLowerCase()

setHeader()
setDashboard(theme)
setFooter()

// Read the template file
const templatePartialPath = path.join(process.cwd(), "partials", `template.hbs`);
const templatePartial = fs.readFileSync(templatePartialPath, 'utf-8');
const template = handlebars.compile(templatePartial);

// Load and inline the CSS and JavaScript
const cssContent = fs.readFileSync(`./styles/${theme}.css`, 'utf8');
const jsClock = fs.readFileSync('./js/clock.js', 'utf8');
const jsSearch = fs.readFileSync('./js/search.js', 'utf8');
const meta = getMeta();

config.inlineCss = cssContent; // Pass the CSS to the template
config.clockJs = jsClock;   // Pass the JavaScript to the template
config.searchJs = jsSearch;   // Pass the JavaScript to the template
config.meta = meta; // Set metadata

// Load and validate with the schema
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const ajv = new Ajv();
const validate = ajv.compile(schema);

if (!validate(config)) {
  console.error("Configuration validation failed:", validate.errors);
  process.exit(1); // Exit if validation fails
}

// Generate HTML and save it
const html = template(config);
fs.outputFileSync('./dist/index.html', html);
console.log('HTML page generated successfully!');