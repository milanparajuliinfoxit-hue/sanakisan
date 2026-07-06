const { asyncHandler } = require('../middlewares');
const committeeTypeServices = require('../services/committeeTypeServices');

const getAll = asyncHandler(async (req, res) => {
  const { page, limit, search } = req.query;
  const data = await committeeTypeServices.getAll(page, limit, search);
  return res.status(200).json({ status: true, message: 'Committee Types fetched successfully.', data });
});

const getActive = asyncHandler(async (req, res) => {
  const data = await committeeTypeServices.getActive();
  return res.status(200).json({ status: true, message: 'Active Committee Types fetched successfully.', data });
});

const getById = asyncHandler(async (req, res) => {
  const data = await committeeTypeServices.getById(req.params.id);
  if (!data) return res.status(404).json({ status: false, message: 'Committee Type not found.' });
  return res.status(200).json({ status: true, message: 'Committee Type found.', data });
});

const create = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const data = await committeeTypeServices.create(name);
  return res.status(201).json({ status: true, message: 'Committee Type created successfully.', data });
});

const update = asyncHandler(async (req, res) => {
  const { name, status } = req.body;
  const data = await committeeTypeServices.update(req.params.id, name, status);
  return res.status(200).json({ status: true, message: 'Committee Type updated successfully.', data });
});

const remove = asyncHandler(async (req, res) => {
  await committeeTypeServices.remove(req.params.id);
  return res.status(200).json({ status: true, message: 'Committee Type deleted successfully.' });
});

module.exports = { getAll, getActive, getById, create, update, remove };
