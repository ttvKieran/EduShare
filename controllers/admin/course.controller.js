const Course = require("../../models/courses.model");
            
module.exports.getCourses = async (req, res) => {
    try {
        const { keyword } = req.query;
        const query = {
            deleted: false
        };
        if (keyword) {
            query.name = { $regex: keyword, $options: "i" };
        }
        const courses = await Course.find(query).sort({ createdAt: -1 })
            // .limit(parseInt(req.query.limit) || 10)
            // .skip(parseInt(req.query.skip) || 0);
        res.status(200).json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách môn học", error });
    }
};

module.exports.getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const courseDetail = await Course.findById(id).populate("facultyId departmentId prerequisites");

        if (!courseDetail) {
            return res.status(404).json({ message: "Môn học không tồn tại" });
        }

        res.status(200).json(courseDetail);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy chi tiết môn học", error });
    }
};

module.exports.createCourse =  async (req, res) => {
    try {
        const courseArray = req.body;
        // console.log(courseArray);
        for(let course of courseArray){
            const newCourse = new Course(course);
            const savedCourse = await newCourse.save();
        }
        // const newCourse = new Course(req.body);
        // const savedCourse = await newCourse.save();
        res.status(201).json("success");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi tạo môn học", error });
    }
}

module.exports.deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;

        // Đánh dấu môn học là đã xóa
        const deletedCourse = await Course.findByIdAndUpdate(
            id,
            { deleted: true, deletedAt: new Date() },
            { new: true }
        );

        if (!deletedCourse) {
            return res.status(404).json({ message: "Môn học không tồn tại" });
        }

        res.status(200).json({ message: "Xóa môn học thành công", deletedCourse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi xóa môn học", error });
    }
};

module.exports.updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Cập nhật thông tin môn học
        const updatedCourse = await Course.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedCourse) {
            return res.status(404).json({ message: "Môn học không tồn tại" });
        }

        res.status(200).json({ message: "Cập nhật môn học thành công", updatedCourse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi cập nhật môn học", error });
    }
};