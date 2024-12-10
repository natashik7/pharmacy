// const { Supplier } = require('../db/models');
const express = require('express');

const supplierRouters = express.Router();

supplierRouters.get('/', async (req, res) => {
  try {
    const suppliers = await Supplier.findAll();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching suppliers', error });
  }
});

supplierRouters.get('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (supplier) {
      res.json(supplier);
    } else {
      res.status(404).json({ message: 'Supplier not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching supplier', error });
  }
});

supplierRouters.post('/', async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json(supplier);
  } catch (error) {
    res.status(400).json({ message: 'Error creating supplier', error });
  }
});

supplierRouters.put('/:id', async (req, res) => {
  try {
    const [updated] = await Supplier.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedSupplier = await Supplier.findByPk(req.params.id);
      res.json(updatedSupplier);
    } else {
      res.status(404).json({ message: 'Supplier not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating supplier', error });
  }
});

supplierRouters.delete('/:id', async (req, res) => {
  try {
    const deleted = await Supplier.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Supplier not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting supplier', error });
  }
});

export default supplierRouters;
