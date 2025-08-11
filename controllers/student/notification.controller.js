const Notification = require("../../models/notifications.model");

module.exports.getNotification = async (req, res) => {
    try {
        const {page, limit} = req.query;
        const skip = (page - 1) * limit;
        // console.log(documentId, page, limit, skip);
        const notifications = await Notification.find()
        // .populate({
        //     path: 'reply.feedbackId'
        // })
        .sort({createdAt: -1})
        .skip(parseInt(skip))
        .limit(parseInt(limit));
        
        const total = notifications.length;
        // const total = await Notification.countDocuments({documentId: documentId, deleted: false, isParent: true});
        res.status(200).json({
            success: true,
            data: {
                notifications,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total/limit)
                }
            }
        });
    } catch (error) {
        res.status(500).json({message: error});
    }  
}

module.exports.getNotificationByCourse = async (req, res) => {
    try {
        const {page, limit} = req.query;
        const skip = (page - 1) * limit;
        const { courseId } = req.params;
        const notifications = await Notification.find({"course.courseId": courseId})
        .sort({createdAt: -1})
        .skip(parseInt(skip))
        .limit(parseInt(limit));
        
        const total = notifications.length;
        res.status(200).json({
            success: true,
            data: {
                notifications,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total/limit)
                }
            }
        });
    } catch (error) {
        res.status(500).json({message: error});
    }  
}