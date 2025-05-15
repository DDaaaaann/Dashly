import { parseArgs } from '../../../src/utils/args';

describe('parseArgs', () => {
  let originalArgv: string[];

  beforeEach(() => {
    originalArgv = process.argv;
    process.argv = ['node', 'script.js'];
  });

  afterEach(() => {
    process.argv = originalArgv;
  });

  it('prints usage and exits when --help is provided', () => {
    process.argv.push('--help');
    const exitMock = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });
    const consoleMock = jest.spyOn(console, 'log').mockImplementation(jest.fn());

    expect(() => parseArgs()).toThrow('process.exit called');
    expect(consoleMock).toHaveBeenCalledWith(expect.stringContaining('USAGE:'));
    exitMock.mockRestore();
    consoleMock.mockRestore();
  });

  it('prints version and exits when --version is provided', () => {
    process.argv.push('--version');
    const exitMock = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });
    const consoleMock = jest.spyOn(console, 'log').mockImplementation(jest.fn());

    expect(() => parseArgs()).toThrow('process.exit called');
    expect(consoleMock).toHaveBeenCalledWith(expect.stringContaining('dashly version'));
    exitMock.mockRestore();
    consoleMock.mockRestore();
  });

  it('sets VERBOSE environment variable when --verbose is provided', () => {
    process.argv.push('--verbose');
    parseArgs();
    expect(process.env.VERBOSE).toBe('true');
  });

  it('sets INPUT_PATH environment variable with default value when --input is not provided', () => {
    parseArgs();
    expect(process.env.INPUT_PATH).toBe('./config.yaml');
  });

  it('sets INPUT_PATH environment variable with provided value when --input is provided', () => {
    process.argv.push('--input', 'custom.yaml');
    parseArgs();
    expect(process.env.INPUT_PATH).toBe('custom.yaml');
  });

  it('sets OUTPUT_PATH environment variable with default value when --output is not provided', () => {
    parseArgs();
    expect(process.env.OUTPUT_PATH).toBe('./index.html');
  });

  it('sets OUTPUT_PATH environment variable with provided value when --output is provided', () => {
    process.argv.push('--output', 'custom.html');
    parseArgs();
    expect(process.env.OUTPUT_PATH).toBe('custom.html');
  });

  it('handles short options for input and output', () => {
    process.argv.push('-i', 'short.yaml', '-o', 'short.html');
    parseArgs();
    expect(process.env.INPUT_PATH).toBe('short.yaml');
    expect(process.env.OUTPUT_PATH).toBe('short.html');
  });

  it('handles missing values for options gracefully', () => {
    process.argv.push('--input');
    parseArgs();
    expect(process.env.INPUT_PATH).toBe('./config.yaml');
  });
});