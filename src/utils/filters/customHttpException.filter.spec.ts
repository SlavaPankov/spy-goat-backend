import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { CustomHttpExceptionFilter } from './customHttpException.filter';

jest.mock('../timeStamp', () => ({ timeStamp: jest.fn().mockReturnValue('05-03-2026 14-07-09') }));

describe('CustomHttpExceptionFilter', () => {
  let filter: CustomHttpExceptionFilter;
  let setHeader: jest.Mock;
  let status: jest.Mock;
  let json: jest.Mock;

  const buildHost = (url: string): ArgumentsHost => {
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
    setHeader = jest.fn();

    return {
      switchToHttp: () => ({
        getRequest: () => ({ url }),
        getResponse: () => ({ setHeader, status }),
      }),
    } as unknown as ArgumentsHost;
  };

  beforeEach(() => {
    filter = new CustomHttpExceptionFilter();
  });

  it('builds the error response from a string exception response', () => {
    const exception = new HttpException('Not found', HttpStatus.NOT_FOUND);
    const host = buildHost('/api/rooms/1');

    filter.catch(exception, host);

    expect(setHeader).toHaveBeenCalledWith('Skip-Logging', 'true');
    expect(status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(json).toHaveBeenCalledWith({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Not found',
      path: '/api/rooms/1',
      timestamp: '05-03-2026 14-07-09',
    });
  });

  it('extracts the message from an object exception response', () => {
    const exception = new HttpException({ message: 'Validation failed', error: 'Bad Request' }, HttpStatus.BAD_REQUEST);
    const host = buildHost('/api/users');

    filter.catch(exception, host);

    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        path: '/api/users',
      })
    );
  });
});
