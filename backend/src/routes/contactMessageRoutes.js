const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const rateLimiter = require('../middlewares/rateLimiter');
const contactMessageController = require('../controller/contactMessageController');
const { validateCreate, validateStatusUpdate, validateIdParam } = require('../middlewares/validation/contactMessageValidation');

router.post('/contact/messages', rateLimiter, validateCreate, contactMessageController.create);

router.get('/admin/messages/stats', auth, isAdmin, contactMessageController.getStats);
router.get('/admin/messages', auth, isAdmin, contactMessageController.getAll);
router.get('/admin/messages/:id', auth, isAdmin, validateIdParam, contactMessageController.getById);
router.patch('/admin/messages/:id/read', auth, isAdmin, validateIdParam, contactMessageController.markAsRead);
router.patch('/admin/messages/:id/status', auth, isAdmin, validateIdParam, validateStatusUpdate, contactMessageController.updateStatus);
router.delete('/admin/messages/:id', auth, isAdmin, validateIdParam, contactMessageController.remove);

module.exports = router;
