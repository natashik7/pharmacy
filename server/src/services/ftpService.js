const fs = require('fs').promises;  
const path = require('path');
const Price = require("../models/Price");
const ftp = require("basic-ftp");
const AdmZip = require("adm-zip");


async function fetchAndProcessFTP(supplier) {
  const client = new ftp.Client();
  const tempPath = path.join(__dirname, "temp", `${supplier.id}.zip`);

  try {
    await client.access({
      host: supplier.ftp_host,
      user: supplier.ftp_user,
      password: supplier.ftp_password,
    });

    await client.downloadTo(tempPath, supplier.ftp_path);

    const zip = new AdmZip(tempPath);
    const extractedPath = path.join(__dirname, "temp", `${supplier.id}`);
    zip.extractAllTo(extractedPath, true);

    const files = await fs.readdir(extractedPath); 

   
    await Promise.all(files.map(async (file) => {
      const filePath = path.join(extractedPath, file);
      const data = await fs.readFile(filePath, "utf8"); 
      const rows = data.split("\n");

      
      await Promise.all(rows.map(async (row) => {
        const [product_name, manufacturer, barcode, price] = row.split(";");

        
        if (product_name && manufacturer && barcode && price) {
          await Price.create({
            supplier_id: supplier.id,
            price_date: new Date(),
            product_name,
            manufacturer,
            barcode,
            price: parseFloat(price),
          });
        }
      }));
    }));

  } catch (err) {
    console.error("FTP error:", err);
  } finally {
    client.close();
  }
}

module.exports = { fetchAndProcessFTP };
