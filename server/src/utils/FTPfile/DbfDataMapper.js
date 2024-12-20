const { logger } = require('./logger');

class DbfDataMapper {
  static mapDbfToPrice(record) {
    try {
      return {
        full_name: this.sanitizeString(this.getFieldValue(record, ['NAME', 'PRODUCT', 'Product', 'PRO_NAME'])),
        manufacturer: this.sanitizeString(this.getFieldValue(record, ['FIRM', 'MANUFACTURER', 'Manufacturer', 'PRODUCER'])),
        barcode: this.sanitizeBarcode(this.getFieldValue(record, ['EAN13', 'BARCODE', 'Barcode', 'SCAN_CODE'])),
        price: this.sanitizePrice(this.getFieldValue(record, ['PRICE', 'COST', 'Price'])),
        expiration_date: this.parseExpirationDate(this.getFieldValue(record, ['GDATE', 'EXPIRATION_DATE', 'END_DATE', 'EXP'])),
        created_at: new Date(),
        updated_at: new Date(),
      };
    } catch (error) {
      logger.error('Ошибка маппинга DBF записи:', error);
      throw error;
    }
  }

  static getFieldValue(record, possibleKeys) {
    for (const key of possibleKeys) {
      if (record[key] !== undefined) {
        return record[key];
      }
    }
    return null; // Если ни одно из полей не найдено
  }

  static sanitizeString(value) {
    if (!value) return 'Не указано';
    return String(value)
      .trim()
      .replace(/\s+/g, ' ') // Заменяем множественные пробелы на один
      .slice(0, 255); // Ограничиваем длину строки
  }

  static sanitizeBarcode(value) {
    if (!value) return 'Не указано';
    const barcode = String(value)
      .replace(/[^0-9]/g, '') // Оставляем только цифры
      .trim();
    return barcode || 'Не указано';
  }

  static sanitizePrice(value) {
    if (!value) return 0;
    const price = parseFloat(value);
    return Number.isNaN(price) ? 0 : Math.max(0, price); // Цена не может быть отрицательной
  }

  static parseExpirationDate(value) {
    if (!value) return null;
    try {
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? null : date;
    } catch (error) {
      logger.warn(`Невозможно распарсить дату: ${value}`);
      return null;
    }
  }

}

module.exports = { DbfDataMapper };