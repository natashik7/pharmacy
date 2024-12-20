const priceRouter = require('express').Router();
const multer = require('multer');
const { Price } = require('../../db/models');
const { uploadFileToFTP } = require('../utils/FTPfile/uploadFileToFTP');
const parseDbfFile = require('../utils/FTPfile/archiveService');
const DbfDataMapper = require('../utils/FTPfile/DbfDataMapper');
const path = require('path');


const storage = multer.memoryStorage(); // Используйте память для хранения файла
const upload = multer({
  storage,
  limits: { fileSize: 1000 * 1024 * 1024 }, // Ограничение на размер файла (10 МБ)
});

priceRouter.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  try {
    await uploadFileToFTP(req.file);
    res.json({ message: 'File uploaded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file', error });
    console.log(error);
  }
});

priceRouter.get('/', async (req, res) => {
  try {
    const prices = await Price.findAll();
    res.json(prices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prices', error });
  }
});

priceRouter.post('/upload_dbf_admin', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    // Сохраняем файл во временную директорию
    const tempFilePath = path.join(__dirname, '../uploads', req.file.originalname);
    await fs.writeFile(tempFilePath, req.file.buffer);

    // Парсим файл с использованием parseDbfFile
    const records = await parseDbfFile(tempFilePath);

    // Применяем DbfDataMapper к каждой записи
    const mappedRecords = records.map((record) => DbfDataMapper.mapDbfToPrice(record));

    // Вставляем данные в базу данных
    await Price.bulkCreate(mappedRecords);

    // Удаляем временный файл
    await fs.unlink(tempFilePath);

    res.json({ message: 'File processed and data saved successfully' });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ message: 'Error processing file', error });
  }
});

module.exports = priceRouter;
