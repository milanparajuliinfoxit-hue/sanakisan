const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const committeePositionController = require('../controller/committeePositionController');
const committeePositionValidation = require('../middlewares/validation/committeePositionValidation');

router.get('/committee-positions', committeePositionController.getAll);
router.get('/committee-positions/active', committeePositionController.getActive);
router.get('/committee-positions/:id', committeePositionController.getById);
router.post('/committee-positions', auth, committeePositionValidation.validateCreate, committeePositionController.create);
router.put('/committee-positions/:id', auth, committeePositionValidation.validateUpdate, committeePositionController.update);
router.delete('/committee-positions/:id', auth, committeePositionController.remove);

module.exports = router;
