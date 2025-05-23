enum LogLevel {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARN = 'WARN',
  DEBUG = 'DEBUG',
}


export class Logger {
  public info(message: string): void {
    this.log(LogLevel.INFO, message);
  }

  public success(message: string): void {
    this.log(LogLevel.SUCCESS, message);
  }

  public warn(message: string): void {
    this.log(LogLevel.WARN, message);
  }

  public error(message: string, error?: unknown): void {
    if (error !== undefined) {
      this.log(LogLevel.ERROR, message, getErrorMessage(error));
    } else {
      this.log(LogLevel.ERROR, message);
    }
  }

  public debug(message: string, ...optionalParams: string []): void {
    this.log(LogLevel.DEBUG, message, ...optionalParams);
  }

  private isVerbose(): boolean {
    return process.env.VERBOSE === 'true';
  }

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private log(level: LogLevel, message: string, ...optionalParams: string[]): void {
    // Skip debug logs if verbose is disabled
    if (level === LogLevel.DEBUG && !this.isVerbose()) return;

    const color = this.getColor(level);

    let formatted;

    if (this.isVerbose()) {
      const time = `[${this.getTimestamp()}] `;
      formatted = `${time}[${level}] ${message}`;
    } else {
      formatted = `${message}`;
    }

    if (optionalParams && optionalParams.length > 0) {
      console.log(this.colorize(formatted, color), ...optionalParams);
    } else {
      console.log(this.colorize(formatted, color));
    }
  }

  private getColor(level: LogLevel): string {
    switch (level) {
      case LogLevel.SUCCESS:
        return '\x1b[32m'; // green
      case LogLevel.ERROR:
        return '\x1b[31m'; // red
      case LogLevel.WARN:
        return '\x1b[33m'; // yellow
      case LogLevel.DEBUG:
        return '\x1b[34m'; // blue
      case LogLevel.INFO:
      default:
        return '\x1b[37m'; // gray/white
    }
  }

  private colorize(message: string, colorCode: string): string {
    return `${colorCode}${message}\x1b[0m`;
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

const log = new Logger();
export default log;