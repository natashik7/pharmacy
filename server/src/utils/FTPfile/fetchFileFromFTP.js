const { Client } = require('basic-ftp');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { ArchiveService } = require('../FTPfile/archiveService.js'); // Импортируем ArchiveService
require('dotenv').config();


// Функция для рекурсивного поиска DBF файлов в директории
const findDbfFiles = async (dir) => {
  const dbfFiles = [];
  const items = await fs.promises.readdir(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      const subFiles = await findDbfFiles(fullPath);
      dbfFiles.push(...subFiles);
    } else if (item.name.toLowerCase().endsWith('.dbf')) {
      dbfFiles.push(fullPath);
    }
  }

  return dbfFiles;
};

// Основная функция для загрузки файлов с FTP
const fetchFilesFromFTP = async () => {
  const client = new Client();
  const tempDir = os.tmpdir();

  try {
    console.log('Начинаем подключение к FTP...');
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: false,
    });

    console.log('Получаем список файлов...');
    const fileList = await client.list('/obmen');
    const archiveFiles = fileList.filter((file) =>
      ['.zip', '.rar'].includes(path.extname(file.name).toLowerCase()),
    );
    console.log(`Найдено ${archiveFiles.length} архивов`);

    for (const archiveFile of archiveFiles) {
      const archivePath = path.join(tempDir, archiveFile.name);
      const extractPath = path.join(tempDir, path.parse(archiveFile.name).name);

      try {
        console.log(`Загружаем архив ${archiveFile.name}...`);
        await client.downloadTo(archivePath, `/obmen/${archiveFile.name}`);

        // Используем ArchiveService для обработки архива
        await ArchiveService.processArchive(archivePath, extractPath);
      } catch (error) {
        console.error(`Ошибка при обработке архива ${archiveFile.name}:`, error);
      } finally {
        // Очищаем временные файлы
        try {
          if (fs.existsSync(extractPath)) {
            await fs.promises.rm(extractPath, { recursive: true, force: true });
            await client.remove(`/obmen/${archiveFile.name}`);
          }
          
          console.log(`Временные файлы для ${archiveFile.name} удалены`);
        } catch (error) {
          console.error('Ошибка при удалении временных файлов:', error);
        }
      }
    }
  } catch (error) {
    console.error('Ошибка при загрузке с FTP:', error);
    throw error;
  } finally {
    client.close();
    console.log('FTP соединение закрыто');
  }
};

module.exports = fetchFilesFromFTP;
