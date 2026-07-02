const asyncHandler = require('../middlewares/asyncHandler');
const badaPatraServices = require('../services/badaPatraServices');

const getBadaPatra = asyncHandler(async (req, res) => {
  const data = await badaPatraServices.getBadaPatra();
  if (data) {
    return res.status(200).json({ status: true, message: 'Bada Patra found.', data });
  }
  return res.status(200).json({ status: false, message: 'No Bada Patra uploaded yet.', data: null });
});

const upsertBadaPatra = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: false, message: 'Image is required.' });
  }
  const data = await badaPatraServices.upsertBadaPatra(req.file.filename, req.user.user_id);
  return res.status(200).json({ status: true, message: 'Bada Patra saved successfully.', data });
});

const updateBadaPatra = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const image = req.file ? req.file.filename : null;
  const data = await badaPatraServices.updateBadaPatra(id, image, req.user.user_id);
  return res.status(200).json({ status: true, message: 'Bada Patra updated successfully.', data });
});

const deleteBadaPatra = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await badaPatraServices.deleteBadaPatra(id);
  return res.status(200).json({ status: true, message: 'Bada Patra deleted successfully.' });
});

module.exports = { getBadaPatra, upsertBadaPatra, updateBadaPatra, deleteBadaPatra };
