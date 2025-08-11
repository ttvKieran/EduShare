const Class = require('../../models/classes.model');

module.exports.getAllClasses = async (req, res) => {
    try {
        const {
            keyword,
        } = req.query;
        const query = {
            deleted: false
        };
        if (keyword) {
            query.className = {
                $regex: keyword,
                $options: "i"
            };
        }
        const classes = await Class.find(query)
            .sort({
                createdAt: -1
            })
            .limit(parseInt(req.query.limit) || 10)
            .skip(parseInt(req.query.skip) || 0);
        res.status(200).json(classes);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Lỗi khi lấy danh sách lớp học",
            error
        });
    }
};

module.exports.getClassById = async (req, res) => {
    try {
        const { classId } = req.params;
        const studentId = req.user._id;

        const classDetail = await Class.findOne({ _id: classId, status: "active" })
            .populate("courseId");

        if (!classDetail) {
            return res.status(404).json({ message: "Không tìm thấy lớp học" });
        }

        res.status(200).json(classDetail);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy chi tiết lớp học", error: error.message });
    }
};