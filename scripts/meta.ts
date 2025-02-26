import fs from "fs-extra";
import * as path from "path";
import {Meta} from "./interface";

function getInlineFavicon(): string {
  const faviconPath = path.join(__dirname, '../favicon/favicon.ico');
  const favicon = fs.readFileSync(faviconPath);
  var base64Favicon = favicon.toString('base64');
  return `<link rel="icon" href="data:image/x-icon;base64,${base64Favicon}">`
}

function getCopyRigthYear(): string {
  return new Date().getFullYear().toString();
}

function getMeta(): Meta {
  return {
    favicon: getInlineFavicon(),
    copyRightYear: getCopyRigthYear()
  }
}

export default getMeta