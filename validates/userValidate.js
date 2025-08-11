module.exports.register = (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin!" });
    }
    if (password.length < 6) {
        return res
            .status(400)
            .json({ message: "Mật khẩu có ít nhất 6 ký tự!" });
    }
    next();
}

module.exports.login = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin!" });
    }
    if (password.length < 6) {
        return res
            .status(400)
            .json({ message: "Mật khẩu có ít nhất 6 ký tự!" });
    }
    next();
}

// module.exports.forgot = (req, res, next) => {
//     if(!req.body.email){
//         req.flash('error', `Email is required.`);
//         res.redirect('back');
//         return;
//     }
//     next();
// }

// module.exports.reset = (req, res, next) => {
//     if(!req.body.password){
//         req.flash('error', `Password is required.`);
//         res.redirect('back');
//         return;
//     }
//     if(!req.body.confirmPassword){
//         req.flash('error', `Confirm Password is required.`);
//         res.redirect('back');
//         return;
//     }
//     if(req.body.password != req.body.confirmPassword){
//         req.flash('error', `Confirm password does not match.`);
//         res.redirect('back');
//         return;
//     }
//     next();
// }