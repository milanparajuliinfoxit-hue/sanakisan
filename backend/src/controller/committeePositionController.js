const { asyncHandler } = require('../middlewares');
const committeePositionServices = require('../services/committeePositionServices');

const getAll = asyncHandler(async (req, res) => {
  const { page, limit, search } = req.query;
  const data = await committeePositionServices.getAll(page, limit, search);
  return res.status(200).json({ status: true, message: 'Committee Positions fetched successfully.', data });
});

const getActive = asyncHandler(async (req, res) => {
  const data = await committeePositionServices.getActive();
  return res.status(200).json({ status: true, message: 'Active Committee Positions fetched successfully.', data });
});

const getById = asyncHandler(async (req, res) => {
  const data = await committeePositionServices.getById(req.params.id);
  if (!data) return res.status(404).json({ status: false, message: 'Committee Position not found.' });
  return res.status(200).json({ status: true, message: 'Committee Position found.', data });
});

const create = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const data = await committeePositionServices.create(name);
  return res.status(201).json({ status: true, message: 'Committee Position created successfully.', data });
});

const update = asyncHandler(async (req, res) => {
  const { name, status } = req.body;
  const data = await committeePositionServices.update(req.params.id, name, status);
  return res.status(200).json({ status: true, message: 'Committee Position updated successfully.', data });
});

const remove = asyncHandler(async (req, res) => {
  await committeePositionServices.remove(req.params.id);
  return res.status(200).json({ status: true, message: 'Committee Position deleted successfully.' });
});

module.exports = { getAll, getActive, getById, create, update, remove };
