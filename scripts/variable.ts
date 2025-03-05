import * as handlebars from "handlebars";

export function registerVariableStorage() {
  handlebars.registerHelper("setVar", function (varName, varValue, options) {
    options.data.root[varName] = varValue;
  });

  handlebars.registerHelper("getVar", function (varName, options) {
    return options.data.root[varName];
  });
}