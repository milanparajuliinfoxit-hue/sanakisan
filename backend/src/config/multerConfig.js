const multer = require('multer');
const path = require('path');



const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destinationPath = path.resolve(__dirname, '../../public/');
        cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});


const imageFileFilter = function (req, file, cb) {
    // Check if the file type is an image
    const allowedFileTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (mimetype && extname) {
        // Allow images to be uploaded
        cb(null, true);
    } else {
        
        // Reject non-image files
        cb(new Error('Only image files are allowed!'), false);
    }
};

const imageUpload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
    fileFilter: imageFileFilter
});

module.exports = {
    imageUpload,
};