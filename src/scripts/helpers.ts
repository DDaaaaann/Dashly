import * as handlebars from "handlebars";
import log from "../logger/logger";


export function registerHelpers() {
  log.debug('Registering helpers')
  registerVariableStorage();
  registerMathOperators();
  registerBooleanOperators();
}

function registerVariableStorage() {
  log.debug('Registering variable storage')
  handlebars.registerHelper("setVar", function (varName, varValue, options) {
    options.data.root[varName] = varValue;
  });

  handlebars.registerHelper("getVar", function (varName, options) {
    return options.data.root[varName];
  });
}

function registerMathOperators() {
  log.debug('Registering math operators')
  handlebars.registerHelper({
      mod: (v1, v2) => v1 % v2,
      add: (v1, v2) => v1 + v2,
      div: (v1, v2) => v1 / v2,
    }
  )
}

function registerBooleanOperators() {
  log.debug('Registering boolean operators');
  handlebars.registerHelper({
    eq: (v1, v2) => v1 === v2,
    ne: (v1, v2) => v1 !== v2,
    lt: (v1, v2) => v1 < v2,
    gt: (v1, v2) => v1 > v2,
    lte: (v1, v2) => v1 <= v2,
    gte: (v1, v2) => v1 >= v2,
    and(...args: unknown[]) {
      return args.every(Boolean);
    },
    or(...args: unknown[]) {
      return args.slice(0, -1).some(Boolean);
    }
  });
}