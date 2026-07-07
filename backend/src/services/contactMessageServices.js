const { Op } = require('sequelize');
const ContactMessage = require('../../models/ContactMessage');

const create = async ({ full_name, phone, email, message, ip_address, user_agent }) => {
  const duplicate = await ContactMessage.findOne({
    where: {
      email,
      message,
      createdAt: { [Op.gte]: new Date(Date.now() - 60 * 1000) },
    },
  });
  if (duplicate) throw new Error('Duplicate submission detected.');

  return ContactMessage.create({ full_name, phone, email, message, ip_address, user_agent });
};

const getAll = async (page = 1, limit = 10, search = '', status = '', sortField = 'createdAt', sortDir = 'DESC') => {
  const pageNumber = parseInt(page, 10) || 1;
  const pageSize = parseInt(limit, 10) || 10;
  const offset = (pageNumber - 1) * pageSize;

  const allowedSortFields = ['createdAt', 'full_name', 'email', 'status'];
  const orderField = allowedSortFields.includes(sortField) ? sortField : 'createdAt';
  const orderDir = sortDir.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const whereClause = {};
  if (search) {
    whereClause[Op.or] = [
      { full_name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { message: { [Op.like]: `%${search}%` } },
    ];
  }
  if (status) whereClause.status = status;

  const result = await ContactMessage.findAndCountAll({
    where: whereClause,
    limit: pageSize,
    offset,
    order: [[orderField, orderDir]],
  });

  return {
    data: result.rows,
    totalItems: result.count,
    totalPages: Math.ceil(result.count / pageSize),
    currentPage: pageNumber,
  };
};

const getById = async (id) => {
  return ContactMessage.findByPk(id);
};

const markAsRead = async (id, readBy) => {
  const record = await ContactMessage.findByPk(id);
  if (!record) throw new Error('Message not found.');
  await record.update({ is_read: true, read_at: new Date(), read_by: readBy, status: 'READ' });
  return record;
};

const updateStatus = async (id, status) => {
  const record = await ContactMessage.findByPk(id);
  if (!record) throw new Error('Message not found.');
  await record.update({ status });
  return record;
};

const remove = async (id) => {
  const record = await ContactMessage.findByPk(id);
  if (!record) throw new Error('Message not found.');
  await record.update({ status: 'ARCHIVED' });
  return true;
};

const getStats = async () => {
  const [total, newMsgs, read, replied, archived] = await Promise.all([
    ContactMessage.count(),
    ContactMessage.count({ where: { status: 'NEW' } }),
    ContactMessage.count({ where: { status: 'READ' } }),
    ContactMessage.count({ where: { status: 'REPLIED' } }),
    ContactMessage.count({ where: { status: 'ARCHIVED' } }),
  ]);
  return { total, new: newMsgs, read, replied, archived };
};

module.exports = { create, getAll, getById, markAsRead, updateStatus, remove, getStats };
