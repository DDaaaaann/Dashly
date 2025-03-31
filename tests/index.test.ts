import {runDashboardGenerator} from '../src';
import {loadConfig} from '../src/config/config';
import {registerPartials} from '../src/template/partials';
import {registerHelpers} from '../src/scripts/helpers';
import {generateHtml} from '../src/template/template';
import log from '../src/logger/logger';

jest.mock('../src/config/config', () => ({
  loadConfig: jest.fn(),
}));

jest.mock('../src/template/partials', () => ({
  registerPartials: jest.fn(),
}));

jest.mock('../src/template/template', () => ({
  generateHtml: jest.fn(),
}));

jest.mock('../src/scripts/helpers', () => ({
  registerHelpers: jest.fn(),
}));

jest.mock('../src/logger/logger', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

describe('runDashboardGenerator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should run successfully and log success', async () => {
    const dummyConfig = {
      theme: 'Night Owl',
    };

    (loadConfig as jest.Mock).mockResolvedValue(dummyConfig);
    (registerPartials as jest.Mock).mockImplementation(jest.fn());
    (registerHelpers as jest.Mock).mockImplementation(jest.fn());
    (generateHtml as jest.Mock).mockImplementation(jest.fn());

    await runDashboardGenerator();

    expect(loadConfig).toHaveBeenCalledTimes(1);
    expect(registerPartials).toHaveBeenCalledWith('Night Owl');
    expect(registerHelpers).toHaveBeenCalledTimes(1);
    expect(generateHtml).toHaveBeenCalledWith(dummyConfig);
    expect(log.success).toHaveBeenCalledWith('Dashboard generated successfully.');
  });

  it('should throw an error if loadConfig fails', async () => {
    const error = new Error('Failed to load config');
    (loadConfig as jest.Mock).mockRejectedValue(error);

    await expect(runDashboardGenerator()).rejects.toThrow('Failed to load config');

    expect(registerPartials).not.toHaveBeenCalled();
    expect(generateHtml).not.toHaveBeenCalled();
    expect(log.success).not.toHaveBeenCalled();
  });
});
