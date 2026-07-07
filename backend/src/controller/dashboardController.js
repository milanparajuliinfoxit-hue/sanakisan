const asyncHandler = require('../middlewares/asyncHandler');
const dashboardServices = require('../services/dashboardServices');

const getDashboardStats = asyncHandler(async (req, res) => {
  const data = await dashboardServices.getDashboardStats();
  return res.status(200).json({ status: true, message: 'Dashboard stats fetched successfully.', data });
});

module.exports = { getDashboardStats };
