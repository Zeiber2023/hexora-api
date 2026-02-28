import pino from 'pino';

export const logger = pino({
  level: 'info',
  // Quitamos la sección 'transport' si da problemas y lo simplificamos
  // O usamos esta configuración más explícita:
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
});