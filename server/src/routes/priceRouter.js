const express = require('express');
const priceRouter = express.Router();
const { Price } = require('../../db/models');

priceRouter.post('/', async (req, res) => {
  try {
    const price = await Price.create(req.body);
    res.status(200).json(price);
  } catch (error) {
    res.status(400).json(error);
  }
});
priceRouter.get('/', async (req, res) => {
  try {
    const prices = await Price.findAll();
    res.status(200).json(prices);
  } catch (error) {
    res.status(400).json(error);
  }
})

module.exports = priceRouter;