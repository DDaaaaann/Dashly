import Logger from "../../src/scripts/logger";

describe('Logger', () => {

  beforeEach(() => {
    console.log = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('logs info message without verbose', () => {
    const log = new Logger({verbose: false});

    log.info('Test info');

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Test info'));
  });

  test('logs success message without verbose', () => {
    const log = new Logger();

    log.success('Test success');

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Test success'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('\x1b[32m'));  // green
  });

  test('logs warn message without verbose', () => {
    const log = new Logger();

    log.warn('Test warning');

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Test warning'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('\x1b[33m'));  // yellow
  });

  test('logs error message without verbose', () => {
    const log = new Logger();

    log.error('Test error');

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Test error'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('\x1b[31m'));  // red
  });

  test('logs error message with an error object', () => {
    const log = new Logger();
    const error = new Error('Something went wrong');

    log.error('Test error', error);

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Test error'), expect.stringContaining('Something went wrong'));
  });

  test('does not log debug if verbose is false', () => {
    const log = new Logger({verbose: false});

    log.debug('This should not log');

    expect(console.log).not.toHaveBeenCalled();
  });

  test('logs debug if verbose is true', () => {
    const log = new Logger({verbose: true});

    log.debug('Debug log');

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Debug log'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('[DEBUG]'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('\x1b[34m'));  // blue
  });

  test('logs with timestamp and level when verbose is true', () => {
    const log = new Logger({verbose: true});

    log.info('Verbose info');

    expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T/));  // Timestamp pattern
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('[INFO]'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Verbose info'));
  });
});
