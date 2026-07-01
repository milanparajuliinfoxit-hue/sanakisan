const { asyncHandler } = require("../middlewares");
const { pressReleaseServices } = require("../services");

const postPressRelease = asyncHandler(async (req, res, next) => {
  const featuredImage = req.file.filename;

  const created_by = req.user.user_id;
  const pressReleaseData = req.body;
  const data = await pressReleaseServices.postPressRelease(pressReleaseData, created_by, featuredImage);
  if (data) {
    return res.status(200).json({
      status: true,
      message: "Press release created successfully."
    });
  }
  return res.status(200).json({
    status: false,
    message: "Couldn't create press release. Something went wrong."
  });
});

const getPressReleaseImage = asyncHandler(async (req, res, next) => {
  const imageName = req.params.image;
  if (!imageName) {
    return res.status(400).json({ error: 'Image name is required' });
  }

  const imagePath = path.join(__dirname, '..', '..', '..', 'public', 'uploads', imageName);

  // Check if the file exists
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: 'Image not found' });
    }
    fs.createReadStream(imagePath).pipe(res);  // Stream the file to the response
  });
});

const updatePressReleasePublishStatus = asyncHandler(async (req, res, next) => {
  const { pressReleaseId, publish_status } = req.body;

  await pressReleaseServices.updatePressReleasePublishStatus(pressReleaseId, publish_status);

  if (publish_status == 'published') {
    return res.status(201).json({
      status: true,
      message: `Press release has been ${publish_status}`
    });
  }
  return res.status(201).json(Blog_Unpublished());
});

const updatePressRelease = asyncHandler(async (req, res, next) => {

  let featuredImage = "";
  if (req.file) {

    featuredImage = req.file.filename;
  }
  const created_by = req.user.user_id;
  const pressReleaseData = req.body;

  const data = await pressReleaseServices.updatePressRelease(pressReleaseData, featuredImage, created_by);

  if (data) {
    return res.status(200).json({
      status: true,
      message: "Press release updated successfully."
    });
  }

  return res.status(200).json({
    status: false,
    message: "Press release cannot be updated."
  });

});

const deletePressRelease = asyncHandler(async (req, res, next) => {
  const { pressReleaseId } = req.body;
  const data = await pressReleaseServices.deletePressRelease(pressReleaseId);

  if (data) {
    return res.status(200).json({
      status: true,
      message: "Press release deleted successfully."
    });
  }

  return res.status(200).json({
    status: false,
    message: "Press release can't be deleted."
  });

});

const getPressRelease = asyncHandler(async (req, res, next) => {
  const data = await pressReleaseServices.getPressRelease(req.query.pressReleaseId);

  if (data) {
    return res.status(200).json({
      status: true,
      message: "Press release found successfully.",
      data: data
    });
  }

 if (!data) {
  return res.status(404).json({
    status: false,
    message: "Press Release cannot be found."
  });
}
});

const getPressReleasePagination = asyncHandler(async (req, res, next) => {

  const { page, limit, publish_status } = req.query;
  const data = await pressReleaseServices.getPressReleasePagination(page, limit, publish_status);

  if (data) {
    return res.status(200).json({
      status: true,
      message: "Press Release found successfully.",
      data: data
    });
  }

  return res.status(200).json({
    status: false,
    message: "Press Release cannot be found."
  });
});


module.exports = {
  postPressRelease,
  updatePressRelease,
  deletePressRelease,
  getPressRelease,
  getPressReleasePagination,
  getPressReleaseImage,
  updatePressReleasePublishStatus
};