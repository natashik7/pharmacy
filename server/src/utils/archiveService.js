const AdmZip = require('adm-zip');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const fs = require('fs');
const path = require('path');
const { PriceService } = require('../services/PriceService');
const { logger } = require('./logger');
const XLSX = require('xlsx');

class ArchiveService {
  static async extractArchive(archivePath, extractPath) {
    const ext = path.extname(archivePath).toLowerCase();

    await fs.promises.mkdir(extractPath, { recursive: true });

    if (ext === '.zip') {
      logger.info('Распаковываем ZIP архив...');
      const zip = new AdmZip(archivePath);
      zip.extractAllTo(extractPath, true);

      const entries = zip.getEntries();
      logger.info(`В ZIP архиве найдено ${entries.length} файлов/папок`);

      return entries.length;
    }
    if (ext === '.rar') {
      logger.info('Распаковываем RAR архив...');
      try {
        const command = `unrar x -o+ "${archivePath}" "${extractPath}"`;
        await execPromise(command);

        const fileCount = await this.countFiles(extractPath);
        logger.info(`В RAR архиве обработано ${fileCount} файлов/папок`);
        return fileCount;
      } catch (error) {
        logger.error('Ошибка при распаковке RAR архива:', error);
        throw error;
      }
    }
  }

  static async countFiles(dir) {
    let count = 0;
    const items = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        count += await this.countFiles(fullPath);
      } else {
        count++;
      }
    }

    return count;
  }

  static async findDbfFiles(dir) {
    try {
      const dbfFiles = [];
      const items = await fs.promises.readdir(dir, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
          const subFiles = await this.findDbfFiles(fullPath);
          dbfFiles.push(...subFiles);
        } else if (item.name.toLowerCase().endsWith('.dbf')) {
          dbfFiles.push(fullPath);
        }
      }

      return dbfFiles;
    } catch (error) {
      logger.error(`Ошибка при поиске DBF файлов в директории ${dir}:`, error);
      throw error;
    }
  }

  static async parseDbfFile(filePath) {
    try {
      logger.info(`Начинаем парсинг файла: ${path.basename(filePath)}`);
      const workbook = XLSX.readFile(filePath, {
        type: 'file',
        codepage: 866,
        raw: false,
      });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const records = XLSX.utils
        .sheet_to_json(worksheet)
        .filter((record) => record.NAME || record.FIRM || record.EAN13 || record.PRICE);

      logger.info(
        `Получено ${records.length} записей из файла ${path.basename(filePath)}`,
      );
      return records;
    } catch (error) {
      logger.error(`Ошибка при парсинге файла ${filePath}:`, error);
      throw error;
    }
  }

  static async processArchive(archivePath, extractPath) {
    try {
      logger.info(`Начинаем обработку архива: ${path.basename(archivePath)}`);

      await fs.promises.mkdir(extractPath, { recursive: true });

      const filesCount = await this.extractArchive(archivePath, extractPath);
      logger.info(`Архив распакован, найдено файлов/папок: ${filesCount}`);

      // Получаем список папок в извлеченной директории
      const folders = await fs.promises.readdir(extractPath, { withFileTypes: true });
      let counterAgentIdCounter = 1; // Счетчик для генерации уникальных counter_agent_id

      for (const folder of folders) {
        if (folder.isDirectory()) {
          const folderPath = path.join(extractPath, folder.name);
          const dbfFilesInFolder = await this.findDbfFiles(folderPath);
          logger.info(`Найдено ${dbfFilesInFolder.length} DBF файлов в папке ${folder.name}`);

          // Используем имя папки как основу для counter_agent_id
          const counterAgentId = counterAgentIdCounter++;

          for (const dbfPath of dbfFilesInFolder) {
            try {
              logger.info(`Обрабатываем файл: ${path.basename(dbfPath)} в папке ${folder.name}`);
              const records = await this.parseDbfFile(dbfPath);
              
              await PriceService.bulkCreateFromRecords(records, path.basename(dbfPath), counterAgentId);
              logger.info(`Файл ${path.basename(dbfPath)} успешно обработан с counter_agent_id: ${counterAgentId}`);
            } catch (error) {
              logger.error(`Ошибка при обработке файла ${dbfPath}:`, error);
            }
          }
        }
      }

      return true;
    } catch (error) {
      logger.error('Ошибка при обработке архива:', error);
      throw error;
    }
  }
}

module.exports = { ArchiveService };