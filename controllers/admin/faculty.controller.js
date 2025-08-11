const Faculty = require("../../models/faculties.model");

module.exports.getFaculties = async (req, res) => {
    try {
        const { keyword } = req.query;
        const query = {
            deleted: false
        };
        if (keyword) {
            query.name = { $regex: keyword, $options: "i" };
        }
        const faculties = await Faculty.find(query).sort({ createdAt: -1 })
            .limit(parseInt(req.query.limit) || 10)
            .skip(parseInt(req.query.skip) || 0);;
        res.status(200).json(faculties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách khoa", error });
    }
};

module.exports.getFacultyById = async (req, res) => {
    try {
        const { id } = req.params;
        const facultyDetail = await Faculty.findById(id).populate("departments courses dean");

        if (!facultyDetail) {
            return res.status(404).json({ message: "Khoa không tồn tại" });
        }

        res.status(200).json(facultyDetail);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy chi tiết khoa", error });
    }
};

module.exports.createFaculty = async (req, res) => {
    try {
        const newFaculty = new Faculty(req.body);
        const savedFaculty = await newFaculty.save();
        res.status(201).json(savedFaculty);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi tạo khoa", error });
    }
}

module.exports.deleteFaculty = async (req, res) => {
    try {
        const { id } = req.params;

        // Đánh dấu khoa là đã xóa
        const deletedFaculty = await Faculty.findByIdAndUpdate(
            id,
            { deleted: true, deletedAt: new Date() },
            { new: true }
        );

        if (!deletedFaculty) {
            return res.status(404).json({ message: "Khoa không tồn tại" });
        }

        res.status(200).json({ message: "Xóa khoa thành công", deletedFaculty });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi xóa khoa", error });
    }
};

module.exports.updateFaculty = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Cập nhật thông tin khoa
        const updatedFaculty = await Faculty.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedFaculty) {
            return res.status(404).json({ message: "Khoa không tồn tại" });
        }

        res.status(200).json({ message: "Cập nhật khoa thành công", updatedFaculty });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi cập nhật khoa", error });
    }
};