const User = require("../models/users.model");
const authMethodHelper = require("../helpers/authMethode");
const bcrypt = require("bcrypt");
// const redis = require("../configs/connections_redis");

// POST - /user/login
module.exports.login = async (req, res) => {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (!userExists) {
        return res.status(404).json({ message: "Tài khoản không tồn tại!" });
    }
    const isMatch = await bcrypt.compare(password, userExists.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Thông tin đăng nhập không hợp lệ" });
    }
    const accessToken = await authMethodHelper.generateToken(userExists._id);
    const refreshToken = await authMethodHelper.generateRefreshToken(userExists._id);
    if (!accessToken || !refreshToken) {
        return res.status(401).json({ message: "Đăng nhập không thành công, vui lòng thử lại." });
    }
    // await redis.client.set(`refreshToken:${userExists._id}`, JSON.stringify(refreshToken), { EX: 3600*24*31 });
    if (userExists && isMatch) {
        // await redis.client.set(`user:${userExists._id || ''}`, JSON.stringify(userExists), { EX: 3600 });
        req.user = userExists;
        res.status(200).json({ user: userExists, accessToken: accessToken, refreshToken: refreshToken });
    } else {
        res.status(400).json({ message: "Email hoặc mật khẩu không chính xác" });
    }
}

// POST - /user/refresh
module.exports.refreshToken = async (req, res) => {
    const refreshToken = req.headers.authorization.split(" ")[1];
    if (!refreshToken) {
        return res.status(400).json({ message: 'Không nhận được refresh token.' });
    }
    const decoded = await authMethodHelper.verifyRefreshToken(refreshToken);
    if (!decoded) {
        return res.status(400).json({ message: 'Refresh token không hợp lệ.' });
    }
    const user_id = decoded.payload; // Get uses_id from payload
    const user = await User.findOne({ _id: user_id });
    if (!user) {
        return res.status(401).json({ message: 'User không tồn tại.' });
    }
    const accessToken = await authMethodHelper.generateToken(user.id);
    if (!accessToken) {
        return res
            .status(400)
            .json({ message: 'Tạo access token không thành công, vui lòng thử lại.' });
    }
    return res.status(200).json({ accessToken });
};

// GET - /user/logout
module.exports.logout = async (req, res) => {
    try {
        // await redis.client.del(`refreshToken:${req.user._id}`, (err, reply) => {
        //     if(err){
        //         return res.status(500).json({message: "Đăng xuất thất bại!"});
        //     }
        // })
        // await redis.client.del(`user:${req.user._id}`, (err, reply) => {
        //     if(err){
        //         return res.status(500).json({message: "Đăng xuất thất bại!"});
        //     }
        // })
        return res.status(200).json({ message: "Đăng xuất thành công!" });
    } catch (error) {
        return res.status(500).json({message: "Đăng xuất thất bại!"});
    }    
};

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