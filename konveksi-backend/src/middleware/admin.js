const { protect } = require('./auth');

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin only.'
    });
  }
  next();
};

const staffOnly = (req, res, next) => {
  if (!req.user || !req.user.isStaff()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Staff only.'
    });
  }
  next();
};

module.exports = { protect, adminOnly, staffOnly };