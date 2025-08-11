const fs = require('fs');
const { google } = require('googleapis');
const streamifier = require('streamifier');

const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_DRIVE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({ version: 'v3', auth: oauth2Client });

async function uploadToDrive(fileBuffer, fileName, mimeType) {
  return new Promise((resolve, reject) => {
    const bufferStream = streamifier.createReadStream(fileBuffer);

    drive.files.create({
      requestBody: {
        name: fileName,
        mimeType: mimeType,
        parents: ['19boi6EAI_-HQxB9_toDjQe0U-ZJLcr9M']
      },
      media: {
        mimeType: mimeType,
        body: bufferStream
      }
    }, async (err, file) => {
      if (err) return reject(err);

      await drive.permissions.create({
        fileId: file.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      const result = await drive.files.get({
        fileId: file.data.id,
        fields: 'id, name, mimeType, webViewLink, webContentLink',
      });

      resolve(result.data);
    });
  });
}

module.exports = { uploadToDrive };
