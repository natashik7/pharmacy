const { Client } = require('basic-ftp');
const fs = require('fs');
const path = require('path');
const { Price } = require('../../db/models');
const XLSX = require('xlsx');
const os = require('os');
const { ArchiveService } = require('./archiveService'); // Импортируем ArchiveService
require('dotenv').config();

// Функция для проверки и создания директории
const ensureDirectoryExists = async (dirPath) => {
  try {
    await fs.promises.access(dirPath);
  } catch (error) {
    await fs.promises.mkdir(dirPath, { recursive: true });
    console.log(`Создана директория: ${dirPath}`);
  }
};

// Функция для парсинга DBF файлов
const parseDBF = (filePath) =>
  new Promise((resolve, reject) => {
    try {
      // Читаем DBF файл
      const workbook = XLSX.readFile(filePath, {
        type: 'file',
        codepage: 866, // кодировка DOS
        raw: false, // получаем форматированные значения
      });

      // Получаем первый лист
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Конвертируем в массив объектов
      const records = XLSX.utils
        .sheet_to_json(worksheet)
        .filter(
          (record) =>
            // Проверяем наличие обязательных полей
            record.NAME || record.FIRM || record.EAN13 || record.PRICE,
        )
        .map((record) => ({
          full_name: record.NAME ? record.NAME.trim() : 'Не указано',
          manufacturer: record.FIRM ? record.FIRM.trim() : 'Не указано',
          expiration_date: null,
          barcode: record.EAN13 ? record.EAN13.toString().trim() : 'Не указано',
          price: parseFloat(record.PRICE) || 0,
        }));

      console.log(`Парсинг завершен, получено ${records.length} записей`);
      resolve(records);
    } catch (error) {
      console.error('Ошибка при парсинге DBF файла:', error);
      reject(error);
    }
  });

// Функция для записи данных в текстовый файл
const writeRecordsToTxt = async (records, outputFilePath) => {
  try {
    console.log(`Начинаем запись ${records.length} записей в файл...`);

    const outputDir = path.dirname(outputFilePath);
    await ensureDirectoryExists(outputDir);

    const output = records
      .map(
        (record) =>
          `Full Name: ${record.full_name}, Manufacturer: ${record.manufacturer}, Barcode: ${record.barcode}, Price: ${record.price}`,
      )
      .join('\n');

    console.log(`Путь для записи: ${outputFilePath}`);
    await fs.promises.writeFile(outputFilePath, output, {
      encoding: 'utf8',
      flag: 'w',
    });

    const stats = await fs.promises.stat(outputFilePath);
    console.log(`Файл успешно создан, размер: ${stats.size} байт`);
  } catch (error) {
    console.error('Ошибка при записи в файл:', error);
    console.error('Полный путь к файлу:', path.resolve(outputFilePath));
    throw error;
  }
};

// Функция для вставки данных в базу данных
const insertDataToDatabase = async (records) => {
  const batchSize = 100;
  try {
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);

      const barcodes = batch.map((record) => record.barcode).filter(Boolean);
      const existingRecords = await Price.findAll({
        where: { barcode: barcodes },
      });

      const existingBarcodes = new Set(existingRecords.map((record) => record.barcode));
      const recordsToUpdate = batch.filter((record) =>
        existingBarcodes.has(record.barcode),
      );
      const recordsToCreate = batch.filter(
        (record) => !existingBarcodes.has(record.barcode),
      );

      if (recordsToUpdate.length > 0) {
        await Promise.all(
          recordsToUpdate.map((record) =>
            Price.update(
              {
                price: record.price,
                full_name: record.full_name,
                manufacturer: record.manufacturer,
              },
              { where: { barcode: record.barcode } },
            ),
          ),
        );
        console.log(`Обновлено ${recordsToUpdate.length} записей`);
      }

      if (recordsToCreate.length > 0) {
        await Price.bulkCreate(recordsToCreate);
        console.log(`Создано ${recordsToCreate.length} новых записей`);
      }
    }
  } catch (error) {
    console.error('Ошибка при работе с базой данных:', error);
    throw error;
  }
};

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
          }
          if (fs.existsSync(archivePath)) {
            await fs.promises.unlink(archivePath);
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
