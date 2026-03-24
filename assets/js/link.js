/* eslint-disable @typescript-eslint/no-unused-vars */

const OPERA_CTRL_KEY_CODE = 17;
const WEBKIT_CTRL_LEFT_KEY_CODE = 91;
const WEBKIT_CTRL_RIGHT_KEY_CODE = 93;
const FIREFOX_CTRL_KEY_CODE = 224;

function openUrl(url, modifierKey = false) {
  const target = modifierKey ? "_blank" : "_self";
  window.open(url, target);
}

function isModifierKey(e) {
  const keyCode = e.keyCode;
  return e.metaKey
    || e.ctrlKey
    || keyCode === OPERA_CTRL_KEY_CODE
    || keyCode === FIREFOX_CTRL_KEY_CODE
    || keyCode === WEBKIT_CTRL_LEFT_KEY_CODE
    || keyCode === WEBKIT_CTRL_RIGHT_KEY_CODE;
}

function replaceSearchTerm(url, term) {
  return url.replace("[search-term]", encodeURIComponent(term));
}