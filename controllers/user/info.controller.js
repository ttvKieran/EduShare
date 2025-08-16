const User = require("../../models/users.model");
const authMethodHelper = require("../../helpers/authMethode");
const bcrypt = require("bcrypt");
const redis = require("../../configs/connection_redis_online");

// GET - /user/detail/:id
module.exports.userDetail = async (req, res) => {
    try {
        const user = await User.findById(req.params.user_id).select("-password");
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ message: "Người dùng không tồn tại!" });
    }
    } catch (error) {
        res.status(400).json({message: error});
    }
};

// PATCH - /user/edit/:user_id
module.exports.userEdit = async (req, res) => {
    const user = await User.findById(req.params.user_id).select("-password");
    if (user) {
        const existEmail = await User.find({ _id: { $ne: req.params.user_id }, email: req.body.email });
        if (existEmail.length > 0) {
            res.status(400).json({ message: "Email đã tồn tại" });
            return;
        }
        await User.updateOne({ _id: req.params.user_id }, req.body);
        res.status(200).json({ message: "Sửa thông tin người dùng thành công" });
    } else {
        res.status(404).json({ message: "Người dùng không tồn tại!" });
    }
};