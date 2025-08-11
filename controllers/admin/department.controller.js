const Department = require('../../models/departments.model');

module.exports.getDepartments = async (req, res) => {
    try {
        const { keyword } = req.query;
        const query = {
            deleted: false
        };
        if (keyword) {
            query.name = { $regex: keyword, $options: "i" };
        }
        const departments = await Department.find(query).sort({ createdAt: -1 })
            .limit(parseInt(req.query.limit) || 10)
            .skip(parseInt(req.query.skip) || 0);;
        res.status(200).json(departments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách bộ môn", error });
    }
};

module.exports.getDepartmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const departmentDetail = await Department.findById(id).populate("facultyId head.userId staff courses");

        if (!departmentDetail) {
            return res.status(404).json({ message: "Bộ môn không tồn tại" });
        }

        res.status(200).json(departmentDetail);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy chi tiết bộ môn", error });
    }
};

module.exports.createDepartment = async (req, res) => {
    try {
        const newDepartment = new Department(req.body);
        const savedDepartment = await newDepartment.save();
        res.status(201).json(savedDepartment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi tạo bộ môn", error });
    }
}
module.exports.deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;

        // Đánh dấu bộ môn là đã xóa
        const deletedDepartment = await Department.findByIdAndUpdate(
            id,
            { deleted: true, deletedAt: new Date() },
            { new: true }
        );

        if (!deletedDepartment) {
            return res.status(404).json({ message: "Bộ môn không tồn tại" });
        }

        res.status(200).json({ message: "Xóa bộ môn thành công", deletedDepartment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi xóa bộ môn", error });
    }
};

module.exports.updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedDepartment = await Department.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedDepartment) {
            return res.status(404).json({ message: "Bộ môn không tồn tại" });
        }

        res.status(200).json({ message: "Cập nhật bộ môn thành công", updatedDepartment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi cập nhật bộ môn", error });
    }
};