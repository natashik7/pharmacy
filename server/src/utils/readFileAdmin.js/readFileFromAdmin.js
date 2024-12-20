const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const { logger } = require('../FTPfile/logger');


async function readFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case '.xlsx':
    case '.xls':
    case '.xltx':
      return readXlsxFile(filePath);
    case '.ods':
      return readOdsFile(filePath);
    case '.dbf':
      return readDbfFile(filePath);
    default:
      throw new Error(`Unsupported file format: ${ext}`);
  }
}

async function readXlsxFile(filePath) {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const records = XLSX.utils.sheet_to_json(worksheet);
    const decodedRecords = decodeRecords(records);
    logger.info(`Successfully read ${records.length} records from ${filePath}`);
    return decodedRecords;
  } catch (error) {
    logger.error(`Error reading XLSX file ${filePath}:`, error);
    throw error;
  }
}

async function readOdsFile(filePath) {
  // Для ODS можно использовать библиотеку xlsx, так как она поддерживает ODS
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const records = XLSX.utils.sheet_to_json(worksheet);
    const decodedRecords = decodeRecords(records);
    logger.info(`Successfully read ${records.length} records from ${filePath}`);
    return decodedRecords;
  } catch (error) {
    logger.error(`Error reading ODS file ${filePath}:`, error);
    throw error;
  }
}

async function readDbfFile(filePath) {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const records = XLSX.utils.sheet_to_json(worksheet);
    const mappedRecords = records.map(record => DbfDataMapper.mapDbfToPrice(record));
    logger.info(`Successfully read and mapped ${mappedRecords.length} records from ${filePath}`);
    return mappedRecords;
  } catch (error) {
    logger.error(`Error reading DBF file ${filePath}:`, error);
    throw error;
  }
}

function decodeRecords(records) {
  return records.map(record => {
    const decodedRecord = {};
    for (const [key, value] of Object.entries(record)) {
      decodedRecord[key] = typeof value === 'string' ? Buffer.from(value, 'binary').toString('utf-8') : value;
    }
    return decodedRecord;
  });
}

module.exports = { readFile };