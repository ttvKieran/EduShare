const Faculty = require('../../models/faculties.model');
const Department = require('../../models/departments.model');
const Course = require('../../models/courses.model');
const Class = require('../../models/classes.model');

module.exports.getOverviewStats = async (req, res) => {
    try {
        const facultyCount = await Faculty.countDocuments({ deleted: false });
        const departmentCount = await Department.countDocuments({ deleted: false });
        const courseCount = await Course.countDocuments({ deleted: false });
        const classCount = await Class.countDocuments({ deleted: false });

        res.status(200).json({
            faculties: facultyCount,
            departments: departmentCount,
            courses: courseCount,
            classes: classCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi thống kê tổng quan", error });
    }
};

module.exports.getStatsByFaculty = async (req, res) => {
    try {
        const faculties = await Faculty.find({ deleted: false }).populate('departments courses');

        const stats = await Promise.all(
            faculties.map(async (faculty) => {
                const departmentCount = await Department.countDocuments({ facultyId: faculty._id, deleted: false });
                const courseCount = await Course.countDocuments({ facultyId: faculty._id, deleted: false });
                const classCount = await Class.countDocuments({ courseId: { $in: faculty.courses }, deleted: false });

                return {
                    facultyName: faculty.name,
                    departments: departmentCount,
                    courses: courseCount,
                    classes: classCount
                };
            })
        );

        res.status(200).json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi thống kê theo khoa", error });
    }
};

module.exports.getStatsByDepartment = async (req, res) => {
    try {
        const departments = await Department.find({ deleted: false }).populate('courses');

        const stats = await Promise.all(
            departments.map(async (department) => {
                const courseCount = await Course.countDocuments({ departmentId: department._id, deleted: false });
                const classCount = await Class.countDocuments({ courseId: { $in: department.courses }, deleted: false });

                return {
                    departmentName: department.name,
                    courses: courseCount,
                    classes: classCount
                };
            })
        );

        res.status(200).json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi thống kê theo bộ môn", error });
    }
};

module.exports.getClassesByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const classes = await Class.find({ courseId, deleted: false }).populate('instructor students');

        res.status(200).json(classes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách lớp học theo môn học", error });
    }
};

module.exports.getStudentsByClass = async (req, res) => {
    try {
        const { classId } = req.params;

        const classDetail = await Class.findById(classId).populate('students');

        if (!classDetail) {
            return res.status(404).json({ message: "Lớp học không tồn tại" });
        }

        res.status(200).json(classDetail.students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách sinh viên theo lớp học", error });
    }
};