import path from 'path';
import {readFile} from "./file";

export const getInlineCss = (theme: string) =>
    readFile(__dirname, path.join('..', '..', 'assets', 'styles', `${theme}.css`), 'CSS file');

export const getClockJs = () =>
    readFile(__dirname, path.join('..', '..', 'assets', 'js', 'clock.js'), 'Clock JS');

export const getSearchJs = () =>
    readFile(__dirname, path.join('..', '..', 'assets', 'js', 'search.js'), 'Search JS');
