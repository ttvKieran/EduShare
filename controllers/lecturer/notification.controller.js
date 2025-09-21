const Course = require("../../models/courses.model");
const Class = require("../../models/classes.model");
const Documet = require("../../models/documents.model");
const Notification = require("../../models/notifications.model");


module.exports.getNotificationOfLecturer = async (req, res) => {
    try {
        const {page, limit} = req.query;
        const skip = (page - 1) * limit;
        const notifications = await Notification.find({deleted: false, "author.authorId": req.user._id})
        .populate('author.authorId')
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
        res.status(500).json(error);
    }
};

module.exports.createNotification = async (req, res) => {
    try {
        const { title, content, priority, type, courseId, documentId, classId } = req.body;
        const notification = new Notification({title, content, priority, type, deleted: false});
        if(courseId){
            const course = await Course.find({deleted: false, _id: courseId});
            notification.course = {
                courseId: courseId,
                name: course.name
            };
        }
        if(classId){
            const classItem = await Course.find({_id: classId}).populate('courseId');
            notification.class = {
                classId: classId,
                name: classItem.name
            };
        }
        if(documentId){
            const document = await Document.find({deleted: false, _id: documentId});
            notification.document = {
                documentId: documentId,
                name: document.name
            };
        }
        notification.author = {
            authorId: req.user._id,
            name: req.user.name
        }
        await notification.save();
        res.status(200).json({
            success: true,
            data: {
                notification
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }
};

module.exports.getNotificationOfClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const {page, limit} = req.query;
        const skip = (page - 1) * limit;
        const notifications = await Notification.find({'class.classId': classId, deleted: false})
        .populate('author.authorId')
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
        res.status(500).json(error);
    }
};

module.exports.getNotificationOfCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const {page, limit} = req.query;
        const skip = (page - 1) * limit;
        const notifications = await Notification.find({'course.courseId': courseId, deleted: false})
        .populate('author.authorId')
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
        res.status(500).json(error);
    }
};

module.exports.deleteNotification = async (req, res) => {
    try {
        const {id} = req.params;
        await Notification.updateOne({_id: id}, {deleted: true});
        res.status(200).json({
            success: true
        });
    } catch (error) {
        res.status(500).json(error);
    }
};