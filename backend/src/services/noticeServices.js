const Notice = require("../../models/Notice");

const postNotice = async (noticeData, created_by, featuredImage) => {


  const { title, content, publishStatus, author, publishDate } = noticeData;
  const data = await Notice.create({ title, featuredImage, content, publishStatus, author, created_by, publishDate });
  return data;

};

const updatePublishStatus = async (noticeId) => {
  const result = await Notice.update({ publishStatus }, { where: { id: noticeId } });
  return result;
};

const updateNotice = async (noticeData, created_by, featuredImage) => {
  const { id, title, content, publishStatus, author, publishDate } = noticeData;

  const updateData = {
    title,
    content,
    publishStatus,
    author,
    created_by,
    publishDate
  };
  if (featuredImage) {
    updateData.featuredImage = featuredImage;
  }
  const data = await Notice.update(updateData, { where: { id } });

  return data;
};

const deleteNotice = async (noticeData) => {
  const noticeId = noticeData.noticeId;
  const data = await Notice.update({ status: 0 }, { where: { id: noticeId } });
  return data;
};

const getNotice = async (noticeId) => {
  const result = await Notice.findByPk(noticeId, {
    attributes: ['id', 'title', 'featuredImage', 'content', 'publishStatus', 'publishDate', 'author', 'createdAt', 'updatedAt']
  });
  return result;
};



const getNoticePagination = async (page = 1, limit = 10, publish_status) => {


  const publishStatus = publish_status || undefined;

  // Ensure page and limit are integers and default to 1 and 10 if not provided
  const pageNumber = parseInt(page, 10) || 1;
  const pageSize = parseInt(limit, 10) || 10;

  const offset = (pageNumber - 1) * pageSize;

  const whereClause = {
    status: 1,
    ...(publishStatus !== undefined && { publishStatus }), // Only include 
  };

  // Fetch paginated results and total count
  const result = await Notice.findAndCountAll({
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
  postNotice,
  updatePublishStatus,
  updateNotice,
  deleteNotice,
  getNotice,
  getNoticePagination
};