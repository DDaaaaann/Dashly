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

export const getSectionsJS = () =>
    readFile(__dirname, path.join('..', '..', 'assets', 'js', 'sections.js'), 'Sections JS');

// export const getAlertsJS = () => [
//   readFile(__dirname, path.join('..', '..', 'assets', 'js', 'alerts.js'), 'Alert JS'),
//   readFile(__dirname, path.join('..', '..', 'assets', 'js', 'schedule-engine.js'), 'Schedule JS'),
// ].join('\n');

export const getAlertsJS = () => [
  readFile(__dirname, path.join('..', '..', 'assets', 'js', 'alerts', 'utils.js'), 'Utils JS'),
  readFile(__dirname, path.join('..', '..', 'assets', 'js', 'alerts', 'filters.js'), 'Filters JS'),
  readFile(__dirname, path.join('..', '..', 'assets', 'js', 'alerts', 'generators.js'), 'Generator JS'),
  readFile(__dirname, path.join('..', '..', 'assets', 'js', 'alerts', 'schedule.js'), 'Schedule JS'),
  readFile(__dirname, path.join('..', '..', 'assets', 'js', 'alerts', 'alerts.js'), 'Alert JS'),
].join('\n');
