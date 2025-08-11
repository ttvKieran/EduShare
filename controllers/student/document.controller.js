const Document = require("../../models/documents.model");
const Favorite = require('../../models/favorites.model');

module.exports.getAllDocuments = async (req, res) => {
  try {
    const { type, search, page = 1, limit = 10 } = req.query;
    const studentId = req.user._id;

    const filter = {
      status: "active",
      deleted: false,
      ...(type && { type }),
      ...(search && {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } }
        ]
      })
    };

    if(req.query.classId){
      filter.classId = req.query.classId;
    }
    if(req.query.courseId){
      filter.courseId = req.query.courseId;
    }
    
    const documents = await Document.find(filter)
      .populate('uploadedBy.user_id', 'name email')
      .populate('courseId', 'name code')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    // const documents = await Document.aggregate([
    //   { $match: filter },
    //   {
    //     $lookup: {
    //       from: 'favorites',
    //       let: { docId: '$_id' },
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: {
    //               $and: [
    //                 { $eq: ['$documentId', '$$docId'] },
    //                 { $eq: ['$studentId', studentId] }
    //               ]
    //             }
    //           }
    //         }
    //       ],
    //       as: 'favoriteStatus'
    //     }
    //   },
    //   {
    //     $addFields: {
    //       isFavorited: { $gt: [{ $size: '$favoriteStatus' }, 0] }
    //     }
    //   },
    //   { $sort: { createdAt: -1 } },
    //   { $skip: (page - 1) * limit },
    //   { $limit: parseInt(limit) }
    // ]);

    const total = await Document.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      data: {
        documents,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi khi lấy danh sách tài liệu", 
      error: error.message 
    });
  }
};

module.exports.getFavorites = async (req, res) => {
  try {
    const studentId = req.user._id;
    console.log(studentId)
    const favorites = await Favorite.find({ studentId, type: 'favorite' })
      .populate('documentId', 'title fileType createdAt')
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: favorites
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi khi lấy danh sách yêu thích", 
      error: error.message 
    });
  }
};

module.exports.getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findById(id)
      // .populate('uploadedBy.user_id', 'name email')
      // .populate('courseId', 'name code')
      // .populate('classId', 'className');
    
    if (!document || document.deleted) {
      return res.status(404).json({ 
        success: false,
        message: "Không tìm thấy tài liệu" 
      });
    }
    res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi khi lấy chi tiết tài liệu", 
      error: error.message 
    });
  }
};

// module.exports.previewDocument = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const document = await Document.findById(id);
    
//     if (!document || document.deleted) {
//       return res.status(404).json({ 
//         success: false,
//         message: 'Không tìm thấy tài liệu' 
//       });
//     }
    
//     if (!document.isPreviewable) {
//       return res.status(400).json({ 
//         success: false,
//         message: 'Tài liệu không thể xem trước' 
//       });
//     }
    
//     // Tăng view count
//     await Document.findByIdAndUpdate(id, {
//       $inc: { viewCount: 1 }
//     });
    
//     res.status(200).json({
//       success: true,
//       data: {
//         previewUrl: document.previewUrl,
//         title: document.title,
//         fileType: document.fileType,
//         mimeType: document.mimeType,
//         cloudinaryUrl: document.cloudinaryUrl
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ 
//       success: false,
//       message: "Lỗi khi xem trước tài liệu", 
//       error: error.message 
//     });
//   }
// };

// module.exports.previewDocument = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const document = await Document.findById(id);
        
//         if (!document || document.deleted) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Không tìm thấy tài liệu'
//             });
//         }

//         if (!document.isPreviewable) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Tài liệu không thể xem trước'
//             });
//         }

//         // Tăng view count
//         await Document.findByIdAndUpdate(id, {
//             $inc: { viewCount: 1 }
//         });

//         res.status(200).json({
//             success: true,
//             data: {
//                 previewUrl: document.previewUrl,
//                 title: document.title,
//                 fileType: document.fileType,
//                 mimeType: document.mimeType,
//                 cloudinaryUrl: document.cloudinaryUrl
//             }
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             success: false,
//             message: "Lỗi khi xem trước tài liệu",
//             error: error.message
//         });
//     }
// };

// module.exports.previewDocument = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const document = await Document.findById(id);
       
//         if (!document || document.deleted) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Không tìm thấy tài liệu'
//             });
//         }

//         if (!document.isPreviewable) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Tài liệu không thể xem trước'
//             });
//         }

//         // Tăng view count
//         await Document.findByIdAndUpdate(id, {
//             $inc: { viewCount: 1 }
//         });

//         // Tạo preview URL tối ưu dựa trên loại file
//         let previewUrl = document.previewUrl;
        
//         // Với Office files, sử dụng URL có đuôi file rõ ràng
//         if (document.mimeType.includes('officedocument') || 
//             document.mimeType.includes('msword') || 
//             document.mimeType.includes('ms-excel') || 
//             document.mimeType.includes('ms-powerpoint')) {
            
//             // Tạo URL với đuôi file rõ ràng cho Google Docs Viewer
//             const fileExtension = document.extension;
//             const cloudinaryUrlWithExt = `${document.cloudinaryUrl}${fileExtension}`;
            
//             // Sử dụng Microsoft Office Online hoặc Google Docs Viewer
//             const officeOnlineUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(cloudinaryUrlWithExt)}`;
//             const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(cloudinaryUrlWithExt)}&embedded=true`;
            
//             // Thử Office Online trước, fallback về Google Docs
//             previewUrl = officeOnlineUrl;
            
//             // Thêm fallback URL
//             res.status(200).json({
//                 success: true,
//                 data: {
//                     previewUrl: previewUrl,
//                     fallbackPreviewUrl: googleDocsUrl,
//                     directUrl: cloudinaryUrlWithExt,
//                     title: document.title,
//                     fileType: document.fileType,
//                     mimeType: document.mimeType,
//                     cloudinaryUrl: document.cloudinaryUrl,
//                     canDirectDownload: true
//                 }
//             });
//             return;
//         }

//         // Cho PDF và hình ảnh
//         res.status(200).json({
//             success: true,
//             data: {
//                 previewUrl: previewUrl,
//                 title: document.title,
//                 fileType: document.fileType,
//                 mimeType: document.mimeType,
//                 cloudinaryUrl: document.cloudinaryUrl
//             }
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             success: false,
//             message: "Lỗi khi xem trước tài liệu",
//             error: error.message
//         });
//     }
// };

module.exports.previewDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await Document.findById(id);
       
        if (!document || document.deleted) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy tài liệu'
            });
        }

        if (!document.isPreviewable) {
            return res.status(400).json({
                success: false,
                message: 'Tài liệu không thể xem trước'
            });
        }

        // Tăng view count
        await Document.findByIdAndUpdate(id, {
            $inc: { viewCount: 1 }
        });

        // Tạo preview URL tối ưu
        let previewUrl = document.previewUrl;
        let fallbackPreviewUrl = null;
        let directUrl = document.cloudinaryUrl;

        // Xử lý đặc biệt cho Office files
        if (document.mimeType.includes('officedocument') || 
            document.mimeType.includes('msword') || 
            document.mimeType.includes('ms-excel') || 
            document.mimeType.includes('ms-powerpoint')) {
            
            // Tạo URL proxy qua server của bạn
            const proxyUrl = `${req.protocol}://${req.get('host')}/api/documents/${id}/file`;
            
            // Sử dụng nhiều viewer khác nhau
            const viewers = [
                // Google Docs Viewer
                `https://docs.google.com/viewer?url=${encodeURIComponent(proxyUrl)}&embedded=true`,
                // Microsoft Office Online (có thể không hoạt động với Cloudinary)
                `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(proxyUrl)}`,
                // Fallback - direct download
                proxyUrl
            ];
            
            previewUrl = viewers[0];
            fallbackPreviewUrl = viewers[1];
            directUrl = proxyUrl;
        }

        res.status(200).json({
  success: true,
  data: {
    previewUrl: document.previewUrl,
    title: document.title,
    fileType: document.fileType,
    mimeType: document.mimeType,
    cloudinaryUrl: document.cloudinaryUrl, // hoặc đổi thành `downloadUrl`
  }
});

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi xem trước tài liệu",
            error: error.message
        });
    }
};

// Thêm endpoint proxy để serve file với headers đúng
module.exports.serveFile = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await Document.findById(id);
        
        if (!document || document.deleted) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy tài liệu'
            });
        }

        // Redirect với headers phù hợp
        res.setHeader('Content-Type', document.mimeType);
        res.setHeader('Content-Disposition', `inline; filename="${document.fileName}"`);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        
        // Redirect đến Cloudinary URL
        res.redirect(document.cloudinaryUrl);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi lấy file",
            error: error.message
        });
    }
};

// module.exports.downloadDocument = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const document = await Document.findById(id);
    
//     if (!document || document.deleted) {
//       return res.status(404).json({ 
//         success: false,
//         message: 'Không tìm thấy tài liệu' 
//       });
//     }
    
//     // Tăng download count
//     await Document.findByIdAndUpdate(id, {
//       $inc: { downloadCount: 1 }
//     });
    
//     res.status(200).json({
//       success: true,
//       data: {
//         downloadUrl: document.cloudinaryUrl,
//         fileName: document.fileName,
//         title: document.title
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ 
//       success: false,
//       message: "Lỗi khi tải tài liệu", 
//       error: error.message 
//     });
//   }
// };

module.exports.downloadDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findById(id);

    if (!document || document.deleted) {
      return res.status(404).json({ success: false, message: "Tài liệu không tồn tại" });
    }

    // Tăng lượt tải
    await Document.findByIdAndUpdate(id, {
      $inc: { downloadCount: 1 }
    });

    res.status(200).json({
      success: true,
      data: {
        downloadUrl: document.downloadUrl || document.cloudinaryUrl,
        fileName: document.fileName
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi khi tải xuống", error: err.message });
  }
};

module.exports.favoritePost = async (req, res) => {
  try {
    const documentId = req.params.documentId;
    const favorite = new Favorite({studentId: req.user._id, documentId: documentId, type: 'favorite'});
    // console.log(favorite);
    await favorite.save();
    res.status(200).json({message: 'success'});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports.favoriteDelete = async (req, res) => {
  try {
    const documentId = req.params.documentId;
    await Favorite.deleteOne({studentId: req.user._id, documentId: documentId, type: 'favorite'});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}