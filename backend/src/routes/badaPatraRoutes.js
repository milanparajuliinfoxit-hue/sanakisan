const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const { imageUpload } = require('../config/multerConfig');
const { validateIdParam } = require('../middlewares/validation/badaPatraValidation');
const {
  getBadaPatra,
  upsertBadaPatra,
  updateBadaPatra,
  deleteBadaPatra,
} = require('../controller/badaPatraController');

const upload = (req, res, next) => {
  imageUpload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ status: false, message: err.message });
    next();
  });
};

// Public
router.get('/bada-patra', getBadaPatra);

// Protected — admin only
router.post('/admin/bada-patra', auth, isAdmin, upload, upsertBadaPatra);
router.put('/admin/bada-patra/:id', auth, isAdmin, validateIdParam, upload, updateBadaPatra);
router.delete('/admin/bada-patra/:id', auth, isAdmin, validateIdParam, deleteBadaPatra);

module.exports = router;
