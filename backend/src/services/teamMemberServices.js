
const TeamMember = require("../../models/TeamMember");
const CommitteeType = require("../../models/CommitteeType");
const CommitteePosition = require("../../models/CommitteePosition");

const postTeamMember = async (teamMemberData, created_by, feature_image) => {
  const { name, committee_type_id, committee_position_id, email, contact, tenure } = teamMemberData;
  const data = await TeamMember.create({ feature_image, name, committee_type_id, committee_position_id, email, contact, tenure, created_by });
  return data;
};

const updateTeamMemberType = async (teamMemberId, type) => {
  const result = await TeamMember.update({ type }, { where: { id: teamMemberId } });
  return result;
};

const updateTeamMemberPublishStatus = async (teamMemberId, publish_status) => {
  const result = await TeamMember.update({ status: publish_status }, { where: { id: teamMemberId } });
  return result;
};

const updateTeamMember = async (teamData, created_by, feature_image) => {
  const { id, name, committee_type_id, committee_position_id, email, contact, tenure } = teamData;

  const updateData = {
    name,
    committee_type_id,
    committee_position_id,
    email,
    contact,
    tenure,
    created_by,
  };

  if (feature_image) {
    updateData.feature_image = feature_image;
  }

  const [affectedRows] = await TeamMember.update(updateData, { where: { id } });

  if (affectedRows === 0) {
    throw new Error('No team member found with the given id.');
  }

  return affectedRows;
};


const deleteTeamMember = async (teamMemberId) => {
  const result = await TeamMember.update({ status: 0 }, { where: { id: teamMemberId.id } });
  return result;
};

const getTeamMember = async (teamMemberId) => {
  const result = await TeamMember.findByPk(teamMemberId, {
    attributes: ['id', 'feature_image', 'name', 'committee_type_id', 'committee_position_id', 'email', 'contact', 'tenure', 'created_by', 'createdAt', 'updatedAt'],
    include: [
      { model: CommitteeType, as: 'committeeType', attributes: ['id', 'name'] },
      { model: CommitteePosition, as: 'committeePosition', attributes: ['id', 'name'] },
    ],
  });

  if (!result) {
    throw new Error('No team member found with the given id.');
  }

  return result.dataValues;
};


const getTeamMemberPagination = async (page = 1, limit = 10, filters = {}) => {
  const pageNumber = parseInt(page, 10) || 1;
  const pageSize = parseInt(limit, 10) || 10;

  const offset = (pageNumber - 1) * pageSize;

  const whereClause = {
    status: 1,
    ...filters,
  };

  const result = await TeamMember.findAndCountAll({
    where: whereClause,
    limit: pageSize,
    offset,
    order: [['createdAt', 'DESC']],
    include: [
      { model: CommitteeType, as: 'committeeType', attributes: ['id', 'name'] },
      { model: CommitteePosition, as: 'committeePosition', attributes: ['id', 'name'] },
    ],
  });

  const totalPages = Math.ceil(result.count / pageSize);

  return {
    data: result.rows,
    totalItems: result.count,
    totalPages,
    currentPage: pageNumber,
  };
};



module.exports = {
  postTeamMember,
  updateTeamMemberType,
  updateTeamMemberPublishStatus,
  updateTeamMember,
  deleteTeamMember,
  getTeamMember,
  getTeamMemberPagination
};