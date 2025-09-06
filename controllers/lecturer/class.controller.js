const Class = require("../../models/classes.model");

module.exports.getClasses = async (req, res) => {
    try {
        const classes = await Class.find().populate(['courseId', 'studentIds']);
        res.status(200).json({
            success: true,
            data: classes
        });
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports.getScheduleOfLecturer = async (req, res) => {
    try {
        const classes = await Class.find({status: "active", instructorId: req.user._id}).populate('courseId');
        res.status(200).json({
            success: true,
            data: classes
        });
    } catch (error) {
        res.status(500).json(error);
    }
}



// module.exports.getAllClasses = async (req, res) => {
//     try {
//         const {
//             keyword,
//             courseId,
//             instructorId
//         } = req.query;
//         const query = {
//             instructor: req.user._id,
//             deleted: false
//         };
//         if (keyword) {
//             query.className = {
//                 $regex: keyword,
//                 $options: "i"
//             };
//         }
//         if (courseId) {
//             query.courseId = courseId;
//         }
//         if (instructorId) {
//             query.instructor = instructorId;
//         }
//         const classes = await Class.find(query)
//             .sort({
//                 createdAt: -1
//             })
//             .limit(parseInt(req.query.limit) || 10)
//             .skip(parseInt(req.query.skip) || 0);
//         res.status(200).json(classes);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             message: "Lỗi khi lấy danh sách lớp học",
//             error
//         });
//     }
// };

// module.exports.getClassById = async (req, res) => {
//     try {
//         const {
//             id
//         } = req.params;
//         const lecturerId = req.user._id;

//         const classDetail = await Class.findOne({
//                 _id: id,
//                 instructor: lecturerId,
//                 deleted: false
//             })
//             .populate("courseId students")
//             .exec();

//         if (!classDetail) {
//             return res.status(404).json({
//                 message: "Lớp học không tồn tại hoặc bạn không có quyền truy cập"
//             });
//         }

//         res.status(200).json(classDetail);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             message: "Lỗi khi lấy chi tiết lớp học",
//             error
//         });
//     }
// };

// module.exports.getStudentsInClass = async (req, res) => {
//     try {
//         const {
//             id
//         } = req.params;
//         const lecturerId = req.user._id;

//         const classDetail = await Class.findOne({
//                 _id: id,
//                 instructor: lecturerId,
//                 deleted: false
//             })
//             .populate("students")
//             .exec();

//         if (!classDetail) {
//             return res.status(404).json({
//                 message: "Lớp học không tồn tại hoặc bạn không có quyền truy cập"
//             });
//         }

//         res.status(200).json(classDetail.students);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             message: "Lỗi khi lấy danh sách sinh viên",
//             error
//         });
//     }
// };

// module.exports.updateClass = async (req, res) => {
//     try {
//         const {
//             id
//         } = req.params;
//         const lecturerId = req.user._id;
//         const updates = req.body;

//         const updatedClass = await Class.findOneAndUpdate({
//                 _id: id,
//                 instructor: lecturerId,
//                 deleted: false
//             },
//             updates, {
//                 new: true
//             }
//         );

//         if (!updatedClass) {
//             return res.status(404).json({
//                 message: "Lớp học không tồn tại hoặc bạn không có quyền cập nhật"
//             });
//         }

//         res.status(200).json({
//             message: "Cập nhật lớp học thành công",
//             updatedClass
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             message: "Lỗi khi cập nhật lớp học",
//             error
//         });
//     }
// };

// module.exports.deleteStudentInClass = async (req, res) => {
//     try {
//         const {
//             id
//         } = req.params; // ID của sinh viên
//         const {
//             classId
//         } = req.body; // ID của lớp học
//         const lecturerId = req.user._id;

//         const classDetail = await Class.findOne({
//             _id: classId,
//             instructor: lecturerId,
//             deleted: false
//         });

//         if (!classDetail) {
//             return res.status(404).json({
//                 message: "Lớp học không tồn tại hoặc bạn không có quyền truy cập"
//             });
//         }

//         classDetail.students = classDetail.students.filter(student => student.toString() !== id);
//         await classDetail.save();

//         res.status(200).json({
//             message: "Xóa sinh viên khỏi lớp học thành công"
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             message: "Lỗi khi xóa sinh viên khỏi lớp học",
//             error
//         });
//     }
// };