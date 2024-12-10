// const Supplier = require('../models/supplier');

exports.createSupplier = async (req, res) => {
  try {
    const allSuppliers = await Supplier.getAll();
    res.json(allSuppliers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }

  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
