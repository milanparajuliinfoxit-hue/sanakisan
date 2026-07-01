const Event = require("../../models/Events");

const postEvent = async (eventData, created_by, featuredImage) => {

  const { title, content, publishStatus, author, event_date } = eventData;
  const data = await Event.create({ title, featuredImage, content, publish_status: publishStatus, author, created_by, event_date });
  return data;

};

const updatePublishStatus = async (EventId) => {
  const result = await Event.update({ publishStatus }, { where: { id: EventId } });
  return result;
};

const updateEvent = async (eventData, created_by, featuredImage) => {

  const { id, title, content, publishStatus, author, event_date } = eventData;

  // Build the update object dynamically
  const updateData = {
    title,
    content,
    publish_status: publishStatus,
    author,
    created_by,
    event_date
  };

  // Only add featuredImage to the updateData if it's not null or undefined
  if (featuredImage) {
    updateData.featuredImage = featuredImage;
  }

  const data = await Event.update(updateData, { where: { id } });

  return data;
};

const deleteEvent = async (eventId) => {
  const data = await Event.update({ status: 0 }, { where: { id: eventId } });
  return data;
};

const getEvent = async (eventId) => {
  console.log(eventId);

  const result = await Event.findByPk(eventId, {
    attributes: ['id', 'title', 'featuredImage', 'content', 'publish_status', 'event_date', 'author', 'createdAt', 'updatedAt']
  });
  return result;
};




const getEventPagination = async (page = 1, limit = 10, publishedStatus) => {

  const publish_status = publishedStatus || undefined;

  // Ensure page and limit are integers and default to 1 and 10 if not provided
  const pageNumber = parseInt(page, 10) || 1;
  const pageSize = parseInt(limit, 10) || 10;

  const offset = (pageNumber - 1) * pageSize;

  const whereClause = {
    status: 1,
    ...(publish_status !== undefined && { publish_status }), // Only include 
  };


  // Fetch paginated results and total count
  const result = await Event.findAndCountAll({
    where: whereClause,
    limit: pageSize,
    offset: offset,
    order: [['event_date', 'DESC']]
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
  postEvent,
  updatePublishStatus,
  updateEvent,
  deleteEvent,
  getEvent,
  getEventPagination
};