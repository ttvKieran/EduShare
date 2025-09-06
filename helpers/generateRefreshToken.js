// generateRefreshToken.js
const { google } = require('googleapis');
const readline = require('readline');

const CLIENT_ID = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';  
const REDIRECT_URI = 'YOUR_REDIRECT_URI'; // Thường là http://localhost:3000/auth/callback

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Tạo authorization URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive'
  ],
  prompt: 'consent' // Bắt buộc tạo refresh token mới
});

console.log('Mở URL này trong trình duyệt:');
console.log(authUrl);
console.log('\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Nhập authorization code từ URL callback: ', async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    
    console.log('\nTokens generated successfully:');
    console.log('Access Token:', tokens.access_token);
    console.log('Refresh Token:', tokens.refresh_token);
    console.log('\nLưu Refresh Token vào environment variable GOOGLE_DRIVE_REFRESH_TOKEN');
    
    // Test token
    oauth2Client.setCredentials(tokens);
    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    
    const response = await drive.about.get({
      fields: 'user(displayName, emailAddress)'
    });
    
    console.log('\nTest successful! User:', response.data.user);
    
  } catch (error) {
    console.error('Error getting tokens:', error);
  }
  
  rl.close();
});

// Hướng dẫn sử dụng
console.log(`
HƯỚNG DẪN:
1. Chạy script này: node generateRefreshToken.js
2. Mở URL được hiển thị trong trình duyệt
3. Đăng nhập Google và authorize ứng dụng
4. Copy authorization code từ URL callback
5. Paste code vào đây
6. Lưu refresh token vào .env file
`);