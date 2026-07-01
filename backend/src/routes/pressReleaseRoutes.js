const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const pressReleaseValidation = require('../middlewares/validation/pressReleaseValidation');
const pressReleaseController = require('../controller/pressReleaseController');
const { imageUpload } = require('../config/multerConfig');


router
  .route('/admin/savepressrelease')
  .post(
    auth,
    imageUpload.single('featuredImage'),
    pressReleaseValidation.validatePressReleasePost,
    pressReleaseController.postPressRelease
);

router
  .route('/admin/updatepressrelease')
  .put(
    auth,
    (req, res, next) => {
      if (req.headers['content-type'].startsWith('multipart/form-data')) {
        imageUpload.single('featuredImage')(req, res, (err) => {
          if (err) {
            return res.status(400).json({ error: 'Error uploading image.' });
          }
          next();
        });
      } else {
        next();
      }
    },
    pressReleaseValidation.validatePressReleaseUpdate,
    pressReleaseController.updatePressRelease
  );

router
  .route('/getallpressrelease')
  .get(
    pressReleaseValidation.validatePaginationQuery,
    pressReleaseController.getPressReleasePagination
);

router
  .route('/admin/deletepressrelease')
  .put(
    auth,
    pressReleaseValidation.validateDeletePressRelease,
    pressReleaseController.deletePressRelease
  );

router
  .route('/getpressrelease')
  .get(
    pressReleaseValidation.validateGetPressRelease,
    pressReleaseController.getPressRelease
  );

module.exports = router;