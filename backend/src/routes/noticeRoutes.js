const express = require('express');
const { postNotice, getNoticePaginationData, deleteNotice, updateNotice, getNotice } = require('../controller/noticeController');
const { imageUpload } = require('../config/multerConfig');
const { validateNoticePost, validateDeleteNotice, validateNoticeUpdate, validateNoticePaginationQuery, validateNoticeQuery } = require('../middlewares/validation/noticeValidation');
const { auth } = require('../middlewares');
const router = express.Router();

router.route("/admin/postnotice")
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
        validateNoticePost,
        postNotice
    );

router
    .route("/admin/updatenotice")
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
        validateNoticeUpdate,
        updateNotice
    );

router
    .route('/admin/deletenotice')
    .put(
        auth,
        validateDeleteNotice,
        deleteNotice
    );

router.route("/getnoticepagination")
    .get(
        validateNoticePaginationQuery,
        getNoticePaginationData
);

router.route("/getnotice")
    .get(
        validateNoticeQuery,
        getNotice
    );

module.exports = router;