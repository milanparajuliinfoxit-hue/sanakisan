const PressRelease = require("../../models/PressRelease");;

const postPressRelease = async (pressReleaseData, created_by, featuredImage) => {
  const { title, content, publishStatus, author, publishDate } = pressReleaseData;
  const data = await PressRelease.create({ title, featuredImage, content, publishStatus, author, created_by, publishDate });
  return data;

};

const updatePressReleasePublishStatus = async (pressReleaseId, publishStatus) => {
  const result = await PressRelease.update({ publishStatus }, { where: { id: pressReleaseId } });
  return result;
};


const updatePressRelease = async (pressReleaseData, featuredImage, created_by) => {
  const { id, title, content, publishStatus, author, publishDate } = pressReleaseData;

  // Build the update object dynamically
  const updateData = {
    title,
    content,
    publishStatus,
    author,
    created_by,
    publishDate
  };

  // Only add featuredImage to the updateData if it's not null or undefined
  if (featuredImage) {
    updateData.featuredImage = featuredImage;
  }

  // Perform the update
  const [affectedRows] = await PressRelease.update(updateData, { where: { id } });

  if (affectedRows === 0) {
    throw new Error('No press release found with the given id.');
  }

  return affectedRows;
};


const deletePressRelease = async (pressReleaseId) => {
  const data = await PressRelease.update({ status: 0 }, { where: { id: pressReleaseId } });
  return data;
};

const getPressRelease = async (pressReleaseId) => {
  const result = await PressRelease.findByPk(pressReleaseId, {
    attributes: ['id', 'title', 'featuredImage', 'content', 'publishStatus', 'publishDate', 'author', 'createdAt', 'updatedAt']
  });
  return result;
};



const getPressReleasePagination = async (page = 1, limit = 10, publish_status) => {

  const publishStatus = publish_status || undefined

  // Ensure page and limit are integers and default to 1 and 10 if not provided
  const pageNumber = parseInt(page, 10) || 1;
  const pageSize = parseInt(limit, 10) || 10;

  const offset = (pageNumber - 1) * pageSize;

  const whereClause = {
    status: 1,
    ...(publishStatus !== undefined && { publishStatus }), // Only include publishStatus if it's provided
  };
  // Fetch paginated results and total count
  const result = await PressRelease.findAndCountAll({
    where: whereClause,
    limit: pageSize,
    offset: offset,
    order: [['publishDate', 'DESC']]
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
  postPressRelease,
  updatePressReleasePublishStatus,
  updatePressRelease,
  deletePressRelease,
  getPressRelease,
  getPressReleasePagination
};


