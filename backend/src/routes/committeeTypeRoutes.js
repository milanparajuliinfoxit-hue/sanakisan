const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const committeeTypeController = require('../controller/committeeTypeController');
const committeeTypeValidation = require('../middlewares/validation/committeeTypeValidation');

router.get('/committee-types', committeeTypeController.getAll);
router.get('/committee-types/active', committeeTypeController.getActive);
router.get('/committee-types/:id', committeeTypeController.getById);
router.post('/committee-types', auth, committeeTypeValidation.validateCreate, committeeTypeController.create);
router.put('/committee-types/:id', auth, committeeTypeValidation.validateUpdate, committeeTypeController.update);
router.delete('/committee-types/:id', auth, committeeTypeController.remove);

module.exports = router;
