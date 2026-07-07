const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const dashboardController = require('../controller/dashboardController');

router.route('/admin/dashboard/stats').get(auth, dashboardController.getDashboardStats);

module.exports = router;
