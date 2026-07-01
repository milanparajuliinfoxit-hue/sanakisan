const express = require('express');
const { validateEventPost, validateDeleteEvent, validateUpdateEvent, validateEventPagination, validateEventQuery } = require('../middlewares/validation/eventValidation');
const { imageUpload } = require('../config/multerConfig');
const { getEventPagination, saveEvent, deleteEvent, updateEvent, getEvent } = require('../controller/eventController');
const { auth } = require('../middlewares');
const router = express.Router();


router.route("/admin/saveevent")
  .post(
    auth,
    (req, res, next) => {
      // Check if a file is being uploaded (i.e., if 'feature_image' exists)
      if (req.headers['content-type'].startsWith('multipart/form-data')) {
        imageUpload.single('featuredImage')(req, res, (err) => {
          if (err) {
            return res.status(400).json({ error: 'Error uploading image.' });
          }
          next();
        });
      } else {
        next(); // No image upload, proceed to the controller
      }
    },
    validateEventPost,
    saveEvent
);

router
  .route("/geteventpagination")
  .get(
    validateEventPagination,
    getEventPagination
);

router
  .route('/admin/deleteevent')
  .put(
    validateDeleteEvent,
    deleteEvent
  );



router
  .route('/admin/updateevent')
  .put(
    auth,
    (req, res, next) => {
      // Check if a file is being uploaded (i.e., if 'feature_image' exists)
      if (req.headers['content-type'].startsWith('multipart/form-data')) {
        imageUpload.single('featuredImage')(req, res, (err) => {
          if (err) {
            return res.status(400).json({ error: 'Error uploading image.' });
          }
          next();
        });
      } else {
        next(); // No image upload, proceed to the controller
      }
    },
    validateUpdateEvent,
    updateEvent
  );


router.route("/getevent")
  .get(
    validateEventQuery,
    getEvent
  );


module.exports = router;