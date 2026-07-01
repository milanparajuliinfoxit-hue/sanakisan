const { asyncHandler } = require("../middlewares");
const { eventServices } = require("../services/");

const saveEvent = asyncHandler(async (req, res, next) => {
  let featuredImage = "";
  if (req.file) {
    featuredImage = req.file.filename;
  }
  const eventData = req.body;
  const created_by = req.user.user_id;

  const data = await eventServices.postEvent(
    eventData,
    created_by,
    featuredImage,
  );
  if (data) {
    return res.status(200).json({
      status: true,
      message: "Event created successfully.",
    });
  }
  return res.status(200).json({
    status: false,
    message: "Couldn't create Event. Something went wrong.",
  });
});

const updateEvent = asyncHandler(async (req, res, next) => {
  let featuredImage = "";
  if (req.file) {
    featuredImage = req.file.filename;
  }
  const eventData = req.body;
  const created_by = req.user.user_id;

  const data = await eventServices.updateEvent(
    eventData,
    created_by,
    featuredImage,
  );

  if (data) {
    return res.status(200).json({
      status: true,
      message: "Event updated successfully.",
    });
  }

  return res.status(200).json({
    status: false,
    message: "Event cannot be updated.",
  });
});
const deleteEvent = asyncHandler(async (req, res, next) => {
  const { eventId } = req.body;
  const data = await eventServices.deleteEvent(eventId);

  if (data) {
    return res.status(200).json({
      status: true,
      message: "Event deleted successfully.",
    });
  }

  return res.status(200).json({
    status: false,
    message: "Event cannot be deleted.",
  });
});

const getEvent = asyncHandler(async (req, res, next) => {
  // console.log(req.query);

  const data = await eventServices.getEvent(req.query.eventId);

  if (data) {
    return res.status(200).json({
      status: true,
      message: "Event found successfully.",
      data: data,
    });
  }

  return res.status(200).json({
    status: false,
    message: "Event not found.",
    data: data,
  });
});

const getEventPagination = asyncHandler(async (req, res, next) => {
  const { page, limit, publish_status } = req.query;
  const data = await eventServices.getEventPagination(
    page,
    limit,
    publish_status,
  );

  if (data) {
    return res.status(200).json({
      status: true,
      message: "Events found successfully.",
      data: data,
    });
  }

  return res.status(200).json({
    status: false,
    message: "Events cannot be found.",
  });
});

module.exports = {
  saveEvent,
  updateEvent,
  deleteEvent,
  getEvent,
  getEventPagination,
};
