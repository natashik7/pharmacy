const { Client } = require('basic-ftp');
const { Readable } = require('stream'); // Импортируем Readable из stream

const uploadFileToFTP = async (file) => {
  const client = new Client();
  try {
    client.ftp.verbose = true; // Включите подробное логирование

    await client.access({
      host: '178.20.42.235',
      user: 'elf',
      password: 'SMelfVSNiLnTD',
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
