const AdmZip = require('adm-zip');
const Unrar = require('unrar');
const fs = require('fs');
const path = require('path');
const { PriceService } = require('./priceService');


class ArchiveService {
  static async extractArchive(archivePath, extractPath) {
    const ext = path.extname(archivePath).toLowerCase();

    if (ext === '.zip') {
      const zip = new AdmZip(archivePath);
      zip.extractAllTo(extractPath, true);
    } else if (ext === '.rar') {
      return new Promise((resolve, reject) => {
        const rar = new Unrar(archivePath);
        rar.list((err, entries) => {
          if (err) reject(err);

          let completed = 0;
          entries.forEach((entry) => {
            rar.extract(entry.name, extractPath, null, (err) => {
              if (err) console.error(`Ошибка при распаковке ${entry.name}:`, err);
              completed++;
              if (completed === entries.length) resolve();
            });
          });
        });
      });
    }
  }

  static async findDbfFiles(dir) {
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
  }

  static async processArchive(archivePath, extractPath) {
    try {
      await this.extractArchive(archivePath, extractPath);
      const dbfFiles = await this.findDbfFiles(extractPath);

      for (const dbfPath of dbfFiles) {
        const records = await this.parseDbfFile(dbfPath);
        await PriceService.bulkCreateFromRecords(records, path.basename(dbfPath));
      }

      return true;
    } catch (error) {
      console.error('Ошибка при обработке архива:', error);
      throw error;
    }
  }
}

module.exports = { ArchiveService };
