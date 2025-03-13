import path from "path";
import fs from "fs-extra";
import * as handlebars from "handlebars";
import log from "../logger/logger";


export function registerPartials(themeName: string) {
  log.debug('Registering partials')
  registerDashboard(themeName);
  registerHeader();
  registerFooter();
}

function registerHeader() {
  log.debug('Registering header')
  partials('header')
}

function registerDashboard(themeName: string) {
  const theme = themeName.replaceAll(" ", "_").toLowerCase()
  const dashboardPath = path.join(process.cwd(), "src", "templates", `${theme}.hbs`);
  log.debug(`Registering ${themeName} template`)

  if (!fs.existsSync(dashboardPath)) {
    throw new Error(`Theme '${themeName}' does not exist.`);
  }
  register("dashboard", dashboardPath)
}

function registerFooter() {
  log.debug('Registering footer')
  partials('footer')
}

function partials(partialName: string) {
  // Construct the partial path
  const partialPath = path.join(process.cwd(), "src", "partials", `${partialName}.hbs`);
  register(partialName, partialPath)
}

function register(partialName: string, partialPath: string) {
  // Read the partial file
  const partial = fs.readFileSync(partialPath, 'utf-8');

  // Register the partial
  handlebars.registerPartial(partialName, partial)
}
