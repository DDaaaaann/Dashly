import path from 'path';
import { readFile } from "./file";

export const getInlineCss = (theme: string) =>
  readFile(__dirname, path.join('..', '..', 'assets', 'styles', `${theme}.css`), 'CSS file');

export const getClockJs = () =>
  readFile(__dirname, path.join('..', '..', 'assets', 'js', 'clock.js'), 'Clock JS');

export const getSearchJs = () =>
  readFile(__dirname, path.join('..', '..', 'assets', 'js', 'search.js'), 'Search JS');

export const getLinkJs = () =>
  readFile(__dirname, path.join('..', '..', 'assets', 'js', 'link.js'), 'Link JS');

export const getLiveSearchJs = () =>
  readFile(__dirname, path.join('..', '..', 'assets', 'js', 'liveSearch.js'), 'Live Search JS');

export const getIconJS = () =>
  readFile(__dirname, path.join('..', '..', 'assets', 'js', 'icon.js'), 'Icon JS');
