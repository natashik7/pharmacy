const XLSX = require('xlsx');

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

module.exports = { parseDBF };
