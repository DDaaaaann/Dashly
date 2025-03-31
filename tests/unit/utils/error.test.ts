import {getErrorMessage} from '../../../src/utils/error';

describe('getErrorMessage', () => {
  it('should return the error message when the error is an instance of Error', () => {
    const error = new Error('Something went wrong');

    const result = getErrorMessage(error);

    expect(result).toBe('Something went wrong');
  });

  it('should return the string representation of the error when the error is not an instance of Error', () => {
    const error = 'This is a string error';

    const result = getErrorMessage(error);

    expect(result).toBe('This is a string error');
  });

  it('should return the string representation of an unknown error', () => {
    const error = 123;

    const result = getErrorMessage(error);

    expect(result).toBe('123');
  });

  it('should return the string representation of null error', () => {
    const error = null;

    const result = getErrorMessage(error);

    expect(result).toBe('null');
  });

  it('should return the string representation of undefined error', () => {
    const error = undefined;

    const result = getErrorMessage(error);

    expect(result).toBe('undefined');
  });
});
