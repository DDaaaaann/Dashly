import * as file from '../../src/utils/file';
import {getTheme, loadConfig, validateConfig} from '../../src/config/config';
import {DashboardConfig} from "../../src/scripts/interface";
import yaml from "yaml";

const mockConfig: DashboardConfig = {
  meta: {favicon: 'favicon.ico', copyRightYear: '2025'},
  title: 'Mock Dashboard',
  theme: 'My Theme',
  clock: false,
  sections: [],
  inlineCss: '',
  clockJs: '',
  searchJs: '',
};

const compileMock = jest.fn();

jest.mock('ajv', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    compile: compileMock
  })),
}));

jest.mock('yaml', () => ({
  parse: jest.fn().mockReturnValue({theme: 'My Theme'}),
}));

describe('config.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(file, 'readFile').mockImplementation((path: string) => {
      if (path.endsWith('schema.json')) return JSON.stringify({});
      if (path.endsWith('config.yaml')) return 'theme: My Theme';
      return 'mock file content';
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('loadConfig() returns a fully loaded config', async () => {
    const validateFn = jest.fn().mockReturnValue(true);
    compileMock.mockReturnValue(validateFn);

    const config = await loadConfig();

    expect(config.theme).toEqual('My Theme');
    expect(config.inlineCss).toEqual('mock file content');
    expect(config.clockJs).toEqual('mock file content');
    expect(config.meta).toBeDefined();

    expect(file.readFile).toHaveBeenCalledWith(expect.stringContaining('/'), './config.yaml', 'configuration file');
  });

  test('loadConfig() sets default theme when theme is missing', async () => {
    (yaml.parse as jest.Mock).mockReturnValue({
      title: 'No theme config',
      clock: true,
      sections: [],
      meta: {favicon: 'favicon.ico', copyRightYear: '2025'}
    });

    const validateFn = jest.fn().mockReturnValue(true);
    compileMock.mockReturnValue(validateFn);

    const config = await loadConfig();

    expect(config.theme).toBe('Night Owl');
    expect(config.inlineCss).toEqual('mock file content');
  });

  test('getTheme() transforms theme name correctly', () => {
    const theme = getTheme(mockConfig);
    expect(theme).toBe('my_theme');
  });

  test('validateConfig() does nothing if validation succeeds', () => {
    const validateFn = jest.fn().mockReturnValue(true);
    compileMock.mockReturnValue(validateFn);

    expect(() => validateConfig(mockConfig)).not.toThrow();

    expect(compileMock).toHaveBeenCalled();
    expect(validateFn).toHaveBeenCalledWith(mockConfig);
  });

  test('validateConfig() throws if validation fails', () => {
    const validateFn = jest.fn().mockReturnValue(false) as any;
    validateFn.errors = [{message: 'Invalid config!'}];
    compileMock.mockReturnValue(validateFn);

    expect(() => validateConfig(mockConfig)).toThrow(/Invalid config!/);

    expect(compileMock).toHaveBeenCalled();
    expect(validateFn).toHaveBeenCalledWith(mockConfig);
  });
});