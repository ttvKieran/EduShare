const Class = require('../../models/classes.model');
const Course = require('../../models/courses.model');

module.exports.getClasses = async (req, res) => {
    try {
        const { keyword, courseId, instructorId } = req.query;
        const query = {
            deleted: false
        };
        if (keyword) {
            query.className = { $regex: keyword, $options: "i" };
        }
        if (courseId) {
            query.courseId = courseId;
        }
        if (instructorId) {
            query.instructor = instructorId;
        }
        const classes = await Class.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(req.query.limit) || 10)
            .skip(parseInt(req.query.skip) || 0);
        res.status(200).json(classes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách lớp học", error });
    }
};

module.exports.getClassById = async (req, res) => {
    try {
        const { id } = req.params;
        const classDetail = await Class.findById(id).populate("courseId instructor students");
        if (!classDetail) {
            return res.status(404).json({ message: "Lớp học không tồn tại" });
        }

        res.status(200).json(classDetail);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy chi tiết lớp học", error });
    }
};

module.exports.createClass = async (req, res) => {
    try {
        const classArray = req.body;
        // console.log(classArray);
        for(let course of classArray){
            const newCourse = new Class(course);
            const savedCourse = await newCourse.save();
        }
        // const newClass = new Class(req.body);
        // const savedClass = await newClass.save();
        res.status(201).json("success");

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi tạo lớp học", error });
    }
}

module.exports.deleteClass = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedClass = await Class.findByIdAndUpdate(
            id,
            { deleted: true, deletedAt: new Date() },
            { new: true }
        );

        if (!deletedClass) {
            return res.status(404).json({ message: "Lớp học không tồn tại" });
        }

        res.status(200).json({ message: "Xóa lớp học thành công", deletedClass });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi xóa lớp học", error });
    }
};

module.exports.updateClass = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedClass = await Class.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedClass) {
            return res.status(404).json({ message: "Lớp học không tồn tại" });
        }

        res.status(200).json({ message: "Cập nhật lớp học thành công", updatedClass });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi cập nhật lớp học", error });
    }
};