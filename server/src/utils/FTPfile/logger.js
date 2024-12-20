const winston = require('winston');
const path = require('path');

// Создаем форматтер для логов
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(
    ({ timestamp, level, message }) =>
      `[${timestamp}] ${level.toUpperCase()}: ${message}`,
  ),
);

// Создаем логгер
const logger = winston.createLogger({
  level: 'info',
  format: customFormat,
  transports: [
    // Логирование в файл
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Вывод в консоль в режиме разработки
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), customFormat),
    }),
  ],
});

// Создаем специальный логгер для PriceService
const priceServiceLogger = {
  info: (message) => {
    logger.info(`[PriceService] ${message}`);
  },
  error: (message, error) => {
    logger.error(`[PriceService] ${message}`, {
      error: error?.message,
      stack: error?.stack,
    });
  },
  warn: (message) => {
    logger.warn(`[PriceService] ${message}`);
  },
  debug: (message) => {
    logger.debug(`[PriceService] ${message}`);
  },
};

module.exports = {
  logger,
  priceServiceLogger,
};
