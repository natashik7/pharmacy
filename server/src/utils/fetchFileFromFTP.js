const { Client } = require('basic-ftp');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const { Price } = require('../../db/models'); // Импортируйте вашу модель Goods
const dbf = require('dbf'); // Импортируем библиотеку для работы с DBF

// Функция для парсинга DBF файлов
const parseDBF = async (filePath) =>
  new Promise((resolve, reject) => {
    dbf.parseFile(filePath, (err, data) => {
      if (err) {
        return reject(err);
      }
      const records = data.map((record) => ({
        counter_agent_id: record.COUNTER_AGENT_ID, // Замените на имя поля в DBF
        price_date: new Date(), // Замените на имя поля в DBF
        full_name: record.NAME, // Замените на имя поля в DBF
        manufacturer: record.FIRM, // Замените на имя поля в DBF
        expiration_date: record.GDATE,
        barcode: record.CODEFARM, // Замените на имя поля в DBF
        price: parseFloat(record.PRICE), // Замените на имя поля в DBF
      }));
      resolve(records);
    });
  });

// Функция для вставки данных в базу данных
const insertDataToDatabase = async (records) => {
  await Promise.all(
    records.map(async (record) => {
      const exists = await Price.findOne({
        where: {
          barcode: record.barcode,
        },
      });
      if (!exists) {
        await Price.create(record);
      }
    }),
  );
};

// Основная функция для загрузки файлов с FTP
const fetchFilesFromFTP = async () => {
  const client = new Client();
  try {
    client.ftp.verbose = true;

    await client.access({
      host: '178.20.42.235',
      user: 'elf',
      password: 'SMelfVSNiLnTD',
      secure: false,
    });

    // Получаем список файлов в директории
    const fileList = await client.list('/obmen');

    const dbfFiles = fileList.filter((file) => file.name.endsWith('.dbf')); // Фильтруем нужные файлы

    await Promise.all(
      dbfFiles.map(async (file) => {
        const localFilePath = path.join(__dirname, file.name);
        await client.downloadTo(localFilePath, `/obmen/${file.name}`);

        const records = await parseDBF(localFilePath); // Парсим DBF файл
        await insertDataToDatabase(records);

        // Удалите локальный файл после обработки, если это необходимо
        fs.unlinkSync(localFilePath);
      }),
    );
  } catch (error) {
    console.error('Error fetching files from FTP:', error);
    throw error;
  } finally {
    client.close();
  }
};

// Настройка планировщика задач
cron.schedule('0 0 * * *', async () => {
  try {
    await fetchFilesFromFTP();
  } catch (error) {
    console.error('Ошибка при загрузке файлов:', error);
  }
});
