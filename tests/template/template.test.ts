import {compileTemplate, generateHtml} from '../../src/template/template';
import * as fileUtils from '../../src/utils/file';
import log from '../../src/logger/logger';
import * as handlebars from 'handlebars';
import fs from 'fs-extra';
import path from "path";

jest.mock('fs-extra');
jest.mock('handlebars');
jest.mock('../../src/logger/logger');
jest.mock('../../src/utils/file', () => ({
  readFile: jest.fn(),
}));

describe('template.ts', () => {
  const mockDashboardConfig = {
    meta: {favicon: 'favicon.ico', copyRightYear: '2025'},
    title: 'Mock Dashboard',
    theme: 'dark',
    clock: false,
    sections: [],
    inlineCss: '',
    clockJs: '',
    searchJs: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('compileTemplate', () => {
    it('returns a compiled handlebars template', () => {
      const template = '<html>{{title}}</html>';
      const compiledTemplate = jest.fn();

      (fileUtils.readFile as jest.Mock).mockReturnValue(template);
      (handlebars.compile as unknown as jest.Mock).mockReturnValue(compiledTemplate);

      const result = compileTemplate();

      expect(fileUtils.readFile).toHaveBeenCalledWith(expect.stringContaining(`${path.sep}src`), `..${path.sep}partials${path.sep}template.hbs`, 'Handlebars template');
      expect(handlebars.compile).toHaveBeenCalledWith(template);
      expect(result).toBe(compiledTemplate);
    });
  });

  describe('generateHtml', () => {
    it('writes compiled HTML to the output file', () => {
      const html = '<html>Generated HTML</html>';
      const compiledTemplate = jest.fn().mockReturnValue(html);

      (fileUtils.readFile as jest.Mock).mockReturnValue('<html>{{title}}</html>');
      (handlebars.compile as unknown as jest.Mock).mockReturnValue(compiledTemplate);

      generateHtml(mockDashboardConfig);

      expect(fs.outputFileSync).toHaveBeenCalledWith('./index.html', html);
      expect(log.info).toHaveBeenCalledWith('Generating dashboard...');
      expect(log.info).toHaveBeenCalledWith('Dashboard available at ./index.html');
    });

    it('logs an error if template compilation throws', () => {
      (fileUtils.readFile as jest.Mock).mockReturnValue('<html>{{title}}</html>');
      (handlebars.compile as unknown as jest.Mock).mockImplementation(() => {
        throw new Error('Template compile error');
      });

      generateHtml(mockDashboardConfig);

      expect(log.error).toHaveBeenCalledWith('Failed to generate HTML:', expect.any(Error));
    });
  });
});