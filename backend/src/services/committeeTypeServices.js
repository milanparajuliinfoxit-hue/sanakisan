const { Op } = require('sequelize');
const CommitteeType = require('../../models/CommitteeType');

const getAll = async (page = 1, limit = 10, search = '') => {
  const pageNumber = parseInt(page, 10) || 1;
  const pageSize = parseInt(limit, 10) || 10;
  const offset = (pageNumber - 1) * pageSize;

  const whereClause = search
    ? { name: { [Op.like]: `%${search}%` } }
    : {};

  const result = await CommitteeType.findAndCountAll({
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
  return CommitteeType.findAll({
    where: { status: 1 },
    order: [['name', 'ASC']],
    attributes: ['id', 'name'],
  });
};

const getById = async (id) => {
  return CommitteeType.findByPk(id);
};

const create = async (name) => {
  const existing = await CommitteeType.findOne({ where: { name } });
  if (existing) throw new Error('Committee Type with this name already exists.');
  return CommitteeType.create({ name });
};

const update = async (id, name, status) => {
  const existing = await CommitteeType.findOne({
    where: { name, id: { [Op.ne]: id } },
  });
  if (existing) throw new Error('Committee Type with this name already exists.');
  const [affected] = await CommitteeType.update({ name, status }, { where: { id } });
  if (affected === 0) throw new Error('Committee Type not found.');
  return CommitteeType.findByPk(id);
};

const remove = async (id) => {
  const record = await CommitteeType.findByPk(id);
  if (!record) throw new Error('Committee Type not found.');
  await CommitteeType.update({ status: 0 }, { where: { id } });
  return true;
};

module.exports = { getAll, getActive, getById, create, update, remove };
