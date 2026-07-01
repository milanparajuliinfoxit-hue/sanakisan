
const TeamMember = require("../../models/TeamMember");;

const postTeamMember = async (teamMemberData, created_by, feature_image) => {
  
  const { name, position, type, email, contact, tenure } = teamMemberData;
  const data = await TeamMember.create({ feature_image, name, position, type, email, contact, tenure, created_by });
  return data;
};

const updateTeamMemberType = async (teamMemberId, type) => {
  const result = await TeamMember.update({ type }, { where: { id: teamMemberId } });
  return result;
};

const updateTeamMember = async (teamData, created_by, feature_image) => {
  const { id, name, position, type, email, contact, tenure } = teamData;

  // Build the update object dynamically
  const updateData = {
    name,
    position,
    type,
    email,
    contact,
    tenure,
    created_by
  };

  // Only add feature_image to the updateData if it's not null or undefined
  if (feature_image) {
    updateData.feature_image = feature_image;
  }

  // Perform the update
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
    attributes: ['id', 'feature_image', 'name', 'position', 'type', 'email', 'contact', 'tenure', 'created_by', 'createdAt', 'updatedAt']
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
    offset: offset,
    order: [['createdAt', 'DESC']]
  });

  const totalPages = Math.ceil(result.count / pageSize);

  return {
    data: result.rows,
    totalItems: result.count,
    totalPages: totalPages,
    currentPage: pageNumber,
  };

};



module.exports = {
  postTeamMember,
  updateTeamMemberType,
  updateTeamMember,
  deleteTeamMember,
  getTeamMember,
  getTeamMemberPagination
};