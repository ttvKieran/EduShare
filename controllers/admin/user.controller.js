const User = require("../../models/users.model");
const bcrypt = require("bcrypt");

// Lấy tất cả giảng viên
exports.getLecturers = async (req, res) => {
    try {
        const lecturers = await User.find({ role: "lecturer", deleted: false });
        res.status(200).json(lecturers);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// Lấy tất cả sinh viên
exports.getStudents = async (req, res) => {
    try {
        const students = await User.find({ role: "student", deleted: false });
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};

exports.createUser = async (req, res) => {
    try {
        const hashPassword = bcrypt.hashSync(req.body.password, parseInt(process.env.SALT_ROUNDS));
        req.body.password = hashPassword;
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ message: "Người dùng đã được tạo thành công" });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
}

exports.createStudent = async (req, res) => {
    try {
        const { email, studentId, password } = req.body;
        const hashPassword = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS));
        req.body.password = hashPassword;
        const existingUser = await User.findOne({
            $or: [
                { email },
                { studentId }
            ]
        });
        if (existingUser) {
            return res.status(400).json({ message: "Người dùng đã tồn tại" });
        }
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ message: "Người dùng đã được tạo thành công" });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
}

exports.createLecturer = async (req, res) => {
    try {
        const { email, staffId, password } = req.body;
        const hashPassword = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS));
        req.body.password = hashPassword;
        const existingUser = await User.findOne({
            $or: [
                { email },
                { staffId }
            ]
        });
        if (existingUser) {
            return res.status(400).json({ message: "Người dùng đã tồn tại" });
        }
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ message: "Người dùng đã được tạo thành công" });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const updates = req.body;
        const updatedUser = await User
            .findByIdAndUpdate(userId, updates, { new: true })
            .select("-password");
        if (!updatedUser) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }
        res.status(200).json({ message: "Cập nhật người dùng thành công", updatedUser });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
}