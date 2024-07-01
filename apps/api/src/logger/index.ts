import pino, { Logger as PinoLogger } from 'pino';

import { LogData, Logger } from './types';

const pinoLogger: PinoLogger = pino({
  level: 'info',
});

const parseLoggerInputToPinoFormat = <T>({ message, error, ...data }: LogData<T>) => {
  const formattedData: any = { ...data };
  if (message) formattedData.msg = message;
  if (error) formattedData.err = error;
  return formattedData;
};

const validateLogData = <T>(logData: LogData<T>): boolean => {
  return logData.message !== undefined || logData.error !== undefined;
};

const formatLogData = <T>(logData: LogData<T> | string): LogData<T> => {
  if (typeof logData === 'string') {
    return { message: logData } as LogData<T>;
  }
  return logData;
};

const AppLogger: Logger = {
  debug: <T>(logData: LogData<T>) => {
    if (validateLogData(logData)) pinoLogger.debug(parseLoggerInputToPinoFormat(logData));
  },
  info: <T>(logData: LogData<T>) => {
    if (validateLogData(logData)) pinoLogger.info(parseLoggerInputToPinoFormat(logData));
  },
  warn: <T>(logData: LogData<T>) => {
    if (validateLogData(logData)) pinoLogger.warn(parseLoggerInputToPinoFormat(logData));
  },
  error: <T>(logData: LogData<T> | string) => {
    const formattedLogData = formatLogData<T>(logData);
    if (validateLogData(formattedLogData)) pinoLogger.error(parseLoggerInputToPinoFormat(formattedLogData));
  },
  fatal: <T>(logData: LogData<T>) => {
    if (validateLogData(logData)) pinoLogger.fatal(parseLoggerInputToPinoFormat(logData));
  },
};

export { AppLogger };
