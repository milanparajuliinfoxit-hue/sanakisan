const { asyncHandler } = require('../middlewares');
const contactMessageServices = require('../services/contactMessageServices');
const { DATA_SAVED, SUCCESS_API_FETCH, DATA_DELETED, DATA_NOT_FOUND } = require('../helpers/response');

const create = asyncHandler(async (req, res) => {
  const { full_name, phone, email, message } = req.body;
  const ip_address = req.ip || req.connection.remoteAddress;
  const user_agent = req.headers['user-agent'] || '';
  await contactMessageServices.create({ full_name, phone, email, message, ip_address, user_agent });
  return res.status(201).json(DATA_SAVED('Your message has been sent successfully.'));
});

const getAll = asyncHandler(async (req, res) => {
  const { page, limit, search, status, sortField, sortDir } = req.query;
  const data = await contactMessageServices.getAll(page, limit, search, status, sortField, sortDir);
  return res.status(200).json(SUCCESS_API_FETCH(data, 'Messages fetched successfully.'));
});

const getById = asyncHandler(async (req, res) => {
  const data = await contactMessageServices.getById(req.params.id);
  if (!data) return res.status(404).json(DATA_NOT_FOUND('Message not found.'));
  return res.status(200).json(SUCCESS_API_FETCH(data, 'Message found.'));
});

const markAsRead = asyncHandler(async (req, res) => {
  const data = await contactMessageServices.markAsRead(req.params.id, req.user?.user_id);
  return res.status(200).json(SUCCESS_API_FETCH(data, 'Message marked as read.'));
});

const updateStatus = asyncHandler(async (req, res) => {
  const data = await contactMessageServices.updateStatus(req.params.id, req.body.status);
  return res.status(200).json(SUCCESS_API_FETCH(data, 'Status updated successfully.'));
});

const remove = asyncHandler(async (req, res) => {
  await contactMessageServices.remove(req.params.id);
  return res.status(200).json(DATA_DELETED('Message archived successfully.'));
});

const getStats = asyncHandler(async (req, res) => {
  const data = await contactMessageServices.getStats();
  return res.status(200).json(SUCCESS_API_FETCH(data, 'Stats fetched successfully.'));
});

module.exports = { create, getAll, getById, markAsRead, updateStatus, remove, getStats };
