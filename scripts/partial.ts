import path from "path";
import fs from "fs-extra";
import * as handlebars from "handlebars";

export function setHeader() {
  partial('header')
}

export function setDashboard(themeName: string) {
  // Read the dashboard file
  const theme = themeName.replaceAll(" ", "_").toLowerCase()
  const dashboardPath = path.join(process.cwd(), "templates", `${theme}.hbs`);

  if (!fs.existsSync(dashboardPath)) {
    throw new Error(`Theme '${themeName}' does not exist.`);
  }
  register("dashboard", dashboardPath)
}

export function setFooter() {
  partial('footer')
}

export function setLinks() {
  partial('links')
}

export function setSearchFields() {
  partial('search-fields')
}

function partial(partialName: string) {
  // Construct the partial path
  const partialPath = path.join(process.cwd(), "partials", `${partialName}.hbs`);
  register(partialName, partialPath)
}

function register(partialName: string, partialPath: string) {
  // Read the partial file
  const partial = fs.readFileSync(partialPath, 'utf-8');

  // Register the partial
  handlebars.registerPartial(partialName, partial)
}

export function mathOperators() {
  handlebars.registerHelper({
        mod: (v1, v2) => v1 % v2,
        add: (v1, v2) => v1 + v2
      }
  )
}

export function booleanOperators() {
  handlebars.registerHelper({
    eq: (v1, v2) => v1 === v2,
    ne: (v1, v2) => v1 !== v2,
    lt: (v1, v2) => v1 < v2,
    gt: (v1, v2) => v1 > v2,
    lte: (v1, v2) => v1 <= v2,
    gte: (v1, v2) => v1 >= v2,
    and() {
      return Array.prototype.every.call(arguments, Boolean);
    },
    or() {
      return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
    }
  });
}