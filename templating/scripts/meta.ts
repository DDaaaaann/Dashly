import fs from "fs-extra";
import * as path from "path";
import {Meta} from "./interface";

function getInlineFavicon(): string {
  const faviconPath = path.join(process.cwd(), "assets", "favicon", "favicon.ico");
  const favicon = fs.readFileSync(faviconPath);
  var base64Favicon = favicon.toString('base64');
  return `<link rel="icon" href="data:image/x-icon;base64,${base64Favicon}">`
}

function getCopyRightYear(): string {
  return new Date().getFullYear().toString();
}

function getMeta(): Meta {
  return {
    favicon: getInlineFavicon(),
    copyRightYear: getCopyRightYear()
  }
}

export default getMeta