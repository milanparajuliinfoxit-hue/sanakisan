const express = require('express');
const multer = require('multer');
const router = express.Router();
const auth = require('../middlewares/auth');


const teamMemberValidation = require('../middlewares/validation/teamMemberValidation');
const teamMemberController = require('../controller/teamMemberController');
const { imageUpload } = require('../config/multerConfig')

const multerErrorHandling = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(500).json({ message: err.message });
  } else if (err) {
    return res.status(500).json({ message: err.message });
  }
  next();
};

router
  .route('/createteammember')
  .post(
    auth,
    imageUpload.single('feature_image'),
    multerErrorHandling,
    teamMemberValidation.validateCreateTeamMember,
    teamMemberController.createTeamMember
);

router
  .route('/updateteammember')
  .post(
    auth,
    // imageUpload.single('feature_image'),
    (req, res, next) => {
      // Check if a file is being uploaded (i.e., if 'feature_image' exists)
      if (req.headers['content-type'].startsWith('multipart/form-data')) {
        imageUpload.single('feature_image')(req, res, (err) => {
          if (err) {
            return res.status(400).json({ error: 'Error uploading image.' });
          }
          next();
        });
      } else {
        next(); // No image upload, proceed to the controller
      }
    },
    teamMemberValidation.validateUpdateTeamMember,
    teamMemberController.updateTeamMember
  );

router
  .route('/getallteammember')
  .get(   
    teamMemberController.getTeamMemberPagination
  );

  router
  .route('/admin/deleteteammember')
  .put(teamMemberValidation.validateDeleteTeamMember,teamMemberController.deleteTeamMember)

module.exports = router;