import * as handlebars from "handlebars";


export function registerHelpers() {
  registerVariableStorage();
  registerMathOperators();
  registerBooleanOperators();
}

function registerVariableStorage() {
  handlebars.registerHelper("setVar", function (varName, varValue, options) {
    options.data.root[varName] = varValue;
  });

  handlebars.registerHelper("getVar", function (varName, options) {
    return options.data.root[varName];
  });
}

function registerMathOperators() {
  handlebars.registerHelper({
        mod: (v1, v2) => v1 % v2,
    add: (v1, v2) => v1 + v2,
    div: (v1, v2) => v1 / v2,
      }
  )
}

function registerBooleanOperators() {
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