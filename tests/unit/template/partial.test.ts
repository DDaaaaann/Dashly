import * as fs from 'fs-extra';
import * as path from 'path';
import * as handlebars from 'handlebars';
import {registerPartials} from '../../../src/template/partials';

jest.mock('fs-extra');
jest.mock('path');
jest.mock('handlebars');

describe('registerPartials', () => {
  const themeName = 'Night Owl';

  beforeEach(() => {
    (fs.existsSync as jest.Mock).mockClear();
    (fs.readFileSync as jest.Mock).mockClear();
    (handlebars.registerPartial as jest.Mock).mockClear();
  });

  it('should register partials and call the appropriate functions', () => {
    const mockDashboardPath = 'mock/dashboard/path';
    const mockPartialContent = 'partial content';

    (path.join as jest.Mock)
    .mockReturnValueOnce(mockDashboardPath)
    .mockReturnValueOnce('mock/partials/header.hbs')
    .mockReturnValueOnce('mock/partials/footer.hbs');
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(mockPartialContent);

    registerPartials(themeName);

    expect(path.join).toHaveBeenCalledWith(expect.stringContaining('/src/template'), '..', 'templates', 'night_owl.hbs');
    expect(path.join).toHaveBeenCalledWith(expect.stringContaining('/src/template'), '..', 'partials', 'header.hbs');
    expect(path.join).toHaveBeenCalledWith(expect.stringContaining('/src/template'), '..', 'partials', 'footer.hbs');

    expect(fs.existsSync).toHaveBeenCalledWith(mockDashboardPath);
    expect(fs.readFileSync).toHaveBeenCalledWith('mock/partials/header.hbs', 'utf-8');
    expect(fs.readFileSync).toHaveBeenCalledWith('mock/partials/footer.hbs', 'utf-8');

    expect(handlebars.registerPartial).toHaveBeenCalledWith('header', mockPartialContent);
    expect(handlebars.registerPartial).toHaveBeenCalledWith('footer', mockPartialContent);
    expect(handlebars.registerPartial).toHaveBeenCalledWith('dashboard', mockPartialContent);
  });

  it('should throw an error if the theme does not exist', () => {
    const mockDashboardPath = 'mock/dashboard/path';

    (path.join as jest.Mock).mockReturnValueOnce(mockDashboardPath);
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    expect(() => registerPartials(themeName))
    .toThrowError(`Theme '${themeName}' does not exist.`);
  });
});
