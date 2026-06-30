const path = require("path");
const fs = require("fs");

const asyncHandler = require("../middlewares/asyncHandler");

const getImage = asyncHandler(async (req, res, next) => {
  const imageName = req.params.image;

  if (!imageName) {
    return res.status(400).json({ error: "Image name is required" });
  }

  const imagePath = path.join(__dirname, "../../public", imageName);

  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Set the content-type header based on the file extension
    const fileExtension = path.extname(imageName).toLowerCase();
    const mimeTypes = {
      ".jpeg": "image/jpeg",
      ".jpg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
    };
    const contentType = mimeTypes[fileExtension] || "application/octet-stream";
    res.setHeader("Content-Type", contentType);

    // Stream the image file to the response
    fs.createReadStream(imagePath).pipe(res);
  });
});

const getImageGallery = asyncHandler(async (req, res, next) => {
  const imageName = req.params.image;

  if (!imageName) {
    return res.status(400).json({ error: "Image name is required" });
  }

  const imagePath = path.join(
    __dirname,
    "../../src/public/uploads/gallery",
    imageName,
  );

  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Set the content-type header based on the file extension
    const fileExtension = path.extname(imageName).toLowerCase();
    const mimeTypes = {
      ".jpeg": "image/jpeg",
      ".jpg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
    };
    const contentType = mimeTypes[fileExtension] || "application/octet-stream";
    res.setHeader("Content-Type", contentType);

    // Stream the image file to the response
    fs.createReadStream(imagePath).pipe(res);
  });
});

module.exports = {
  getImage,
  getImageGallery,
};
