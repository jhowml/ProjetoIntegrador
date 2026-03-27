import pino from 'pino';
import { env } from './env';

export const logger = pino({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      levelFirst: true,
      translateTime: 'SYS:HH:MM:ss',
      ignore: 'pid,hostname',
      errorProps: '*',
      customColors: 'fatal:bgMagenta,error:bgRed,warn:bgYellow black,info:cyan,debug:white',
      messageFormat: '{msg}',
    },
  },
});
