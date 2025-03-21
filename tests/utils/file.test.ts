import fs from 'fs-extra';
import {readFile} from '../../src/utils/file';
import log from '../../src/logger/logger';
import {getErrorMessage} from '../../src/utils/error';

jest.mock('fs-extra');
jest.mock('../../src/logger/logger');
jest.mock('../../src/utils/error');

describe('readFile', () => {
  const filePath = 'test/file.txt';
  const fileDescription = 'test file';

  beforeEach(() => {
    (fs.readFileSync as jest.Mock).mockClear();
    (log.debug as jest.Mock).mockClear();
  });

  it('should read file content successfully', () => {
    const mockContent = 'This is a test file content';

    (fs.readFileSync as jest.Mock).mockReturnValue(mockContent);

    const result = readFile(filePath);

    expect(result).toBe(mockContent);
    expect(fs.readFileSync).toHaveBeenCalledWith(filePath, 'utf8');
    expect(log.debug).toHaveBeenCalledWith(`Reading ${filePath}`);
  });

  it('should throw an error if file reading fails', () => {
    const errorMessage = 'Some error occurred';
    const error = new Error(errorMessage);

    (fs.readFileSync as jest.Mock).mockImplementationOnce(() => {
      throw error;
    });
    (getErrorMessage as jest.Mock).mockReturnValue('Custom error message');

    expect(() => readFile(filePath, fileDescription)).toThrowError(
        `Failed to read ${fileDescription} at ${filePath}: Custom error message`
    );
  });
});
