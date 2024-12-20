const { Price } = require('../../db/models');
const { logger } = require('../utils/FTPfile/logger.js');

class PriceService {
  static async bulkCreateFromRecords(records, fileName, counterAgentId) {
    try {
      const formattedRecords = records.map(record => ({
        counter_agent_id: counterAgentId,
        price_date: new Date(),
        full_name: record.NAME || 'Не указано',
        manufacturer: record.FIRM || 'Не указано',
        expiration_date: null,
        barcode: record.EAN13 ? record.EAN13.toString() : 'Не указано',
        price: parseFloat(record.PRICE) || 0
      }));

      const result = await Price.bulkCreate(formattedRecords, {
        updateOnDuplicate: ['price', 'full_name', 'manufacturer', 'price_date']
      });

      logger.info(`Создано/обновлено ${result.length} записей из файла ${fileName}`);
      return result;
    } catch (error) {
      logger.error(`Ошибка при создании записей из файла ${fileName}:`, error);
      throw error;
    }
  }
}

module.exports = { PriceService };