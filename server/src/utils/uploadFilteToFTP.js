const Client = require('basic-ftp');

const uploadFileToFTP = async (file) => {
  const client = new Client();
  try {
    await client.access({
      host: 'your_ftp_host',
      user: 'your_ftp_user',
      password: 'your_ftp_password',
      secure: false,
    });
    await client.uploadFrom(file.buffer, file.originalname);
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};

module.exports = { uploadFileToFTP };
