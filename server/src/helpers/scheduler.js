const cron = require('node-cron');
const fetchFilesFromFTP = require('../utils/FTPfile/fetchFileFromFTP.js');
let isRunning = false;

// Планируем запуск задачи в 1 час ночи
cron.schedule('32 0 * * *', async () => {
  console.log('Запуск fetchFilesFromFTP в 1 час ночи');

  const executionTime = 2 * 60 * 1000; // Время работы 90 минут

  if (isRunning) return;
  isRunning = true;

  try {
    await fetchFilesFromFTP();
  } catch (error) {
    console.error('Ошибка при выполнении fetchFilesFromFTP:', error);
  } finally {
    isRunning = false;
  }

  // Останавливаем выполнение через 90 минут
  setTimeout(() => {
    console.log('fetchFilesFromFTP остановлен после 90 минут работы');
  }, executionTime);
});