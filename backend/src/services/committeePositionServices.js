const { Op } = require('sequelize');
const CommitteePosition = require('../../models/CommitteePosition');

const getAll = async (page = 1, limit = 10, search = '') => {
  const pageNumber = parseInt(page, 10) || 1;
  const pageSize = parseInt(limit, 10) || 10;
  const offset = (pageNumber - 1) * pageSize;

  const whereClause = search
    ? { name: { [Op.like]: `%${search}%` } }
    : {};

  const result = await CommitteePosition.findAndCountAll({
    where: whereClause,
    limit: pageSize,
    offset,
    order: [['createdAt', 'DESC']],
  });

  return {
    data: result.rows,
    totalItems: result.count,
    totalPages: Math.ceil(result.count / pageSize),
    currentPage: pageNumber,
  };
};

const getActive = async () => {
  return CommitteePosition.findAll({
    where: { status: 1 },
    order: [['name', 'ASC']],
    attributes: ['id', 'name'],
  });
};

const getById = async (id) => {
  return CommitteePosition.findByPk(id);
};

const create = async (name) => {
  const existing = await CommitteePosition.findOne({ where: { name } });
  if (existing) throw new Error('Committee Position with this name already exists.');
  return CommitteePosition.create({ name });
};

const update = async (id, name, status) => {
  const existing = await CommitteePosition.findOne({
    where: { name, id: { [Op.ne]: id } },
  });
  if (existing) throw new Error('Committee Position with this name already exists.');
  const [affected] = await CommitteePosition.update({ name, status }, { where: { id } });
  if (affected === 0) throw new Error('Committee Position not found.');
  return CommitteePosition.findByPk(id);
};

const remove = async (id) => {
  const record = await CommitteePosition.findByPk(id);
  if (!record) throw new Error('Committee Position not found.');
  await CommitteePosition.update({ status: 0 }, { where: { id } });
  return true;
};

module.exports = { getAll, getActive, getById, create, update, remove };
