const { Router } = require('express');
const { Supplier } = require('../models');
const supplierRouter = Router();
// Получить список всех поставщиков
supplierRouter
  .get('/', async (req, res) => {
    try {
      const suppliers = await Supplier.findAll();
      res.status(200).json(suppliers);
    } catch (err) {
      res.status(500).json({ error: 'Ошибка получения списка поставщиков.' });
    }
  })
  // Создать нового поставщика
  .post('/', async (req, res) => {
    try {
      const {
        short_name,
        full_name,
        region,
        address,
        phone,
        email,
        ftp_host,
        ftp_user,
        ftp_password,
        ftp_path,
      } = req.body;
      const newSupplier = await Supplier.create({
        short_name,
        full_name,
        region,
        address,
        phone,
        email,
        ftp_host,
        ftp_user,
        ftp_password,
        ftp_path,
      });
      res.status(201).json(newSupplier);
    } catch (err) {
      res.status(500).json({ error: 'Ошибка создания поставщика.' });
    }
  });

// Получить поставщика по ID
supplierRouter
  .get('/:id', async (req, res) => {
    try {
      const supplier = await Supplier.findByPk(req.params.id);
      if (!supplier) {
        return res.status(404).json({ error: 'Поставщик не найден.' });
      }
      res.status(200).json(supplier);
    } catch (err) {
      res.status(500).json({ error: 'Ошибка получения поставщика.' });
    }
  })

  // Обновить информацию о поставщике
  .put('/:id', async (req, res) => {
    try {
      const supplier = await Supplier.findByPk(req.params.id);
      if (!supplier) {
        return res.status(404).json({ error: 'Поставщик не найден.' });
      }

      const {
        short_name,
        full_name,
        region,
        address,
        phone,
        email,
        ftp_host,
        ftp_user,
        ftp_password,
        ftp_path,
      } = req.body;
      await supplier.update({
        short_name,
        full_name,
        region,
        address,
        phone,
        email,
        ftp_host,
        ftp_user,
        ftp_password,
        ftp_path,
      });

      res.status(200).json(supplier);
    } catch (err) {
      res.status(500).json({ error: 'Ошибка обновления поставщика.' });
    }
  })

  // Удалить поставщика
  .delete('/:id', async (req, res) => {
    try {
      const supplier = await Supplier.findByPk(req.params.id);
      if (!supplier) {
        return res.status(404).json({ error: 'Поставщик не найден.' });
      }

      await supplier.destroy();
      res.status(200).json({ message: 'Поставщик успешно удален.' });
    } catch (err) {
      res.status(500).json({ error: 'Ошибка удаления поставщика.' });
    }
  });

module.exports = supplierRouter;
