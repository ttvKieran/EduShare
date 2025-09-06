const Minio = require('minio');
// module.exports = () => {
//     const minioClient = new Minio.Client({
//         endPoint: 'localhost',
//         port: 9000,
//         useSSL: false,
//         accessKey: 'minioadmin',
//         secretKey: 'minioadmin'
//     });
//     // Tạo bucket trong MinIO nếu chưa tồn tại
//     const bucketName = "documents";
//     minioClient.bucketExists(bucketName, function(err, exists) {
//       if (err) {
//         return console.log("Lỗi khi kiểm tra bucket:", err);
//       }
//       if (!exists) {
//         minioClient.makeBucket(bucketName, 'us-east-1', function(err) {
//           if (err) return console.log('Không thể tạo bucket.', err);
//           console.log('Bucket created successfully');
//         });
//       } else {
//         console.log('Bucket đã tồn tại.');
//       }
//     });
// }
module.exports = () => {
  
}