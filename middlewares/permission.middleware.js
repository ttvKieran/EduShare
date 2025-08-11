module.exports.checkPermission = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role?.trim().toLowerCase();
    // console.log(typeof userRole)
    // console.log('User role:', userRole);
    // console.log('Allowed roles:', allowedRoles);
    // console.log(allowedRoles.includes(userRole))
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
    }
    next();
  };
};