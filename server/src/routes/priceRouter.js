const priceRouter = require('express').Router();
const multer = require('multer');
const { Price } = require('../../db/models');
const { uploadFileToFTP } = require('../utils/uploadFileToFTP');

const storage = multer.memoryStorage(); // Используйте память для хранения файла
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Ограничение на размер файла (10 МБ)
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

module.exports = priceRouter;
