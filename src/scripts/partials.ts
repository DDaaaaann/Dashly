import path from "path";
import fs from "fs-extra";
import * as handlebars from "handlebars";


export function registerPartials(themeName: string) {
  registerDashboard(themeName);
  registerHeader();
  registerFooter();
}

function registerHeader() {
  partials('header')
}

function registerDashboard(themeName: string) {
  // Read the dashboard file
  const theme = themeName.replaceAll(" ", "_").toLowerCase()
  const dashboardPath = path.join(process.cwd(), "src", "templates", `${theme}.hbs`);

  if (!fs.existsSync(dashboardPath)) {
    throw new Error(`Theme '${themeName}' does not exist.`);
  }
  register("dashboard", dashboardPath)
}

function registerFooter() {
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
