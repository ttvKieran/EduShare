const Course = require("../../models/courses.model");
const Class = require("../../models/classes.model");
const { validationResult } = require("express-validator");

module.exports.getAllCourses = async (req, res) => {
    try {
        const { keyword } = req.query;
        const query = {
            deleted: false
        };
        if (keyword) {
            query.name = { $regex: keyword, $options: "i" };
        }

        const lecturerId = req.user._id; 
        const classes = await Class.find({ instructor: lecturerId, deleted: false }).select("courseId");
        const courseIds = [...new Set(classes.map(cls => cls.courseId.toString()))];
        const courses = await Course.find({ _id: { $in: courseIds }, ...query }).sort({ createdAt: -1 })
            .limit(parseInt(req.query.limit) || 10)
            .skip(parseInt(req.query.skip) || 0)

        res.status(200).json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách môn học", error });
    }
};

module.exports.getCourseById = async (req, res) => {
    try {
        const { id } = req.params; 
        const lecturerId = req.user._id; 
        const classExists = await Class.findOne({ courseId: id, instructor: lecturerId, deleted: false });
        if (!classExists) {
            return res.status(403).json({ message: "Bạn không có quyền truy cập môn học này" });
        }
        const courseDetail = await Course.findOne({ _id: id, deleted: false })
            .populate("departmentId prerequisites")

        if (!courseDetail) {
            return res.status(404).json({ message: "Môn học không tồn tại" });
        }
        res.status(200).json(courseDetail);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy chi tiết môn học", error });
    }
};

module.exports.getAllClassesByCourse = async (req, res) => {
    try {
        const { id } = req.params; 
        const lecturerId = req.user._id; 
        const classExists = await Class.findOne({ courseId: id, instructor: lecturerId });
        if (!classExists) {
            return res.status(403).json({ message: "Bạn không có quyền truy cập môn học này" });
        }
        const classes = await Class.find({ courseId: id })
        if (!classes) {
            return res.status(404).json({ message: "Không tìm thấy lớp học nào cho môn học này" });
        }
        res.status(200).json(classes);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách lớp học", error });
    }
}