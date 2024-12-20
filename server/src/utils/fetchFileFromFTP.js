const ftp = require('basic-ftp');
const fs = require('fs').promises;
const path = require('path');
const { ArchiveService } = require('./FTPfile/archiveService');
const { logger } = require('./FTPfile/logger');

async function fetchFilesFromFTP() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    await client.access({
      host: "your-ftp-host",
      user: "your-ftp-username",
      password: "your-ftp-password",
      secure: false
    });

    const remoteFilePath = '/path/to/your/archive.zip'; // Убедитесь, что это правильный путь
    const localFilePath = path.join(__dirname, '../../uploads/archive.zip');
    const extractPath = path.join(__dirname, '../../uploads/extracted');

    // Скачиваем файл
    logger.info(`Начинаем загрузку файла с FTP: ${remoteFilePath}`);
    await client.downloadTo(localFilePath, remoteFilePath);
    logger.info(`Файл загружен локально: ${localFilePath}`);

    // Обрабатываем архив
    const processSuccess = await ArchiveService.processArchive(localFilePath, extractPath);

    if (processSuccess) {
      // Удаляем архив локально
      await fs.unlink(localFilePath);
      logger.info(`Локальный файл удален: ${localFilePath}`);

      // Удаляем файл с FTP сервера
      try {
        await client.remove(remoteFilePath);
        logger.info(`Файл удален с FTP сервера: ${remoteFilePath}`);
      } catch (ftpError) {
        logger.error(`Ошибка при удалении файла с FTP сервера: ${ftpError.message}`);
      }
    } else {
      logger.warn('Обработка архива не удалась, файл не будет удален с FTP сервера.');
    }

  } catch (error) {
    logger.error('Ошибка при работе с FTP:', error);
  } finally {
    client.close();
  }
}

module.exports = fetchFilesFromFTP; 