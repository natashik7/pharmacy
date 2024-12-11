const schedule = require("node-schedule");
const { Supplier } = require("../../db/models");
const { fetchAndProcessFTP } = require("./ftpService");

async function initializeSchedules() {
  const suppliers = await Supplier.findAll();
  suppliers.forEach(supplier => {
    schedule.scheduleJob(supplier.schedule, () => {
      fetchAndProcessFTP(supplier);
    });
  });
}

module.exports = { initializeSchedules };