const express = require('express');
const router = express.Router();

const { getImage, getImageGallery } = require("../controller/imageController");

router
  .route('/:image')
  .get(
    getImage
  );

  router
  .route('/getgalleryimage/:image')
  .get(
    getImageGallery
  );

module.exports = router;