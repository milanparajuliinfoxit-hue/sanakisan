const { asyncHandler } = require("../middlewares");
const { noticeServices } = require("../services");

const postNotice = asyncHandler(async (req, res, next) => {

  let featuredImage = "";
  if (req.file) {
    featuredImage = req.file.filename;
  }
  const created_by = req.user.user_id;
  const noticeData = req.body;

  const data = await noticeServices.postNotice(noticeData, created_by, featuredImage);
  if (data) {
    return res.status(200).json({
      status: true,
      message: "Notice created successfully."
    });
  }
  return res.status(200).json({
    status: false,
    message: "Couldn't create notice. Something went wrong."
  });
});

const updateNotice = asyncHandler(async (req, res, next) => {

  let featuredImage = "";
  if (req.file) {
    featuredImage = req.file.filename;
  }
  const created_by = req.user.user_id;
  const noticeData = req.body;

  const data = await noticeServices.updateNotice(noticeData, created_by, featuredImage);

  if (data) {
    return res.status(200).json({
      status: true,
      message: "Notice updated successfully."
    });
  }

  return res.status(200).json({
    status: false,
    message: "Notice cannot be updated."
  });

});

const deleteNotice = asyncHandler(async (req, res, next) => {
  const data = await noticeServices.deleteNotice(req.body);

  if (data) {
    return res.status(200).json({
      status: true,
      message: "Notice deleted successfully."
    });
  }

  return res.status(200).json({
    status: false,
    message: "Notice cannot be deleted."
  });

});

const getNotice = asyncHandler(async (req, res, next) => {
  const data = await noticeServices.getNotice(req.query.noticeId);

  if (data) {
    return res.status(200).json({
      status: true,
      message: "Notice found successfully.",
      data: data
    });
  }

  return res.status(200).json({
    status: false,
    message: "Notice not found.",
    data: data
  });
});

const getNoticePaginationData = asyncHandler(async (req, res, next) => {

  const { page, limit, publish_status } = req.query;
  const data = await noticeServices.getNoticePagination(page, limit, publish_status);

  if (data) {
    return res.status(200).json({
      status: true,
      message: "Notices found successfully.",
      data: data
    });
  }

  return res.status(200).json({
    status: false,
    message: "Notices cannot be found."
  });
});


module.exports = {
  postNotice,
  updateNotice,
  deleteNotice,
  getNotice,
  getNoticePaginationData
};