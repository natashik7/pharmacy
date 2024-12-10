const cron = require('node-cron');
const ftp = require('basic-ftp');
const AdmZip = require('adm-zip');
const xlsx = require('xlsx');
const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');

const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

async function downloadFromFTP(ftpConfig, remoteFilePath, localFilePath) {
  const client = new ftp.Client();
  try {
    await client.access(ftpConfig);
    await client.downloadTo(localFilePath, remoteFilePath);
  } finally {
    client.close();
  }
}

async function processExcelFile(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(sheet);
}

async function insertDataIntoDB(data, supplierId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const row of data) {
      await client.query(
        'INSERT INTO pharmacy_supplier_data (supplier_id, contractor_id, price_date, drug_name, manufacturer, barcode, price) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [
          supplierId,
          row['ID контрагента'],
          new Date(row['Дата прайса']),
          row['Полное наименование препарата'],
          row['производитель'],
          row['штрихкод'],
          parseFloat(row['цена'])
        ]
      );
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function updatePriceList(supplier) {
  const localZipPath = path.join(__dirname, 'temp', `${supplier.id}_price.zip`);
  const extractPath = path.join(__dirname, 'temp', `${supplier.id}_extracted`);

  try {
    await downloadFromFTP(supplier.ftpConfig, supplier.remotePath, localZipPath);

    const zip = new AdmZip(localZipPath);
    zip.extractAllTo(extractPath, true);

    const files = await fs.readdir(extractPath);
    const excelFile = files.find(file => file.endsWith('.xlsx') || file.endsWith('.xls'));
    if (!excelFile) {
      throw new Error('Excel file not found in the archive');
    }

    const excelFilePath = path.join(extractPath, excelFile);
    const data = await processExcelFile(excelFilePath);

    await insertDataIntoDB(data, supplier.id);

    console.log(`Price list updated successfully for supplier ${supplier.id}`);
  } catch (error) {
    console.error(`Error updating price list for supplier ${supplier.id}:`, error);
  } finally {
    await fs.rm(localZipPath, { force: true });
    await fs.rm(extractPath, { recursive: true, force: true });
  }
}

const suppliers = [
  {
    id: 1,
    ftpConfig: {
      host: "ftp.supplier1.com",
      user: "username1",
      password: "password1"
    },
    remotePath: "/price/latest.zip",
    schedule: "0 1 * * *" // Каждый день в час ночи
  },
  {
    id: 2,
    ftpConfig: {
      host: "ftp.supplier2.com",
      user: "username2",
      password: "password2"
    },
    remotePath: "/exports/price.zip",
    schedule: "0 3 * * 1" // Каждый понедельник в 3 ночи
  }
];

suppliers.forEach(supplier => {
  cron.schedule(supplier.schedule, () => {
    updatePriceList(supplier);
  });
});

