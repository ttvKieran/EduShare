const Course = require("../../models/courses.model");
const Class = require("../../models/classes.model");
const Documet = require("../../models/documents.model");
const Notification = require("../../models/notifications.model");

module.exports.createNotification = async (req, res) => {
    try {
        const { title, content, priority, type, courseId, documentId } = req.body;
        const notification = new Notification({title, content, priority, type});
        if(courseId){
            const course = await Course.find({deleted: false, _id: courseId});
            notification.course = {
                courseId: courseId,
                name: course.name
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