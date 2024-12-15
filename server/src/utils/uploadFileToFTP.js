const { Client } = require('basic-ftp');
const { Readable } = require('stream'); // Импортируем Readable из stream
require('dotenv').config();

const uploadFileToFTP = async (file) => {
  const client = new Client();
  try {
    client.ftp.verbose = true; // Включите подробное логирование

    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: false,
    });

    const serverPath = `/obmen/${file.originalname}`;

    // Преобразуем Buffer в поток
    const stream = new Readable();
    stream.push(file.buffer);
    stream.push(null); // Завершаем поток

    await client.uploadFrom(stream, serverPath); // Используем поток для загрузки
  } catch (error) {
    console.error('Error uploading file to FTP:', error);
    throw error;
  } finally {
    client.close();
  }
};

module.exports = { uploadFileToFTP };
