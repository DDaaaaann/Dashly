/* eslint-disable @typescript-eslint/no-unused-vars */

const operaCtrlKeyCode = 17;
const webkitCtrlLeftKeyCode = 91;
const webkitCtrlRightKeyCode = 93;
const firefoxCtrlKeyCode = 224;

function openUrl(url, modifierKey = false) {
  if (modifierKey) {
    window.open(url, "_blank")
  } else {
    window.open(url, "_self")
  }
}

function isModifierKey(e) {
  var keyCode = e.keyCode;
  return e.metaKey
    || e.ctrlKey
    || keyCode === operaCtrlKeyCode
    || keyCode === firefoxCtrlKeyCode
    || keyCode === webkitCtrlLeftKeyCode
    || keyCode === webkitCtrlRightKeyCode
}

function replaceSearchTerm(url, term) {
  return url.replace("[search-term]", encodeURIComponent(term));
}