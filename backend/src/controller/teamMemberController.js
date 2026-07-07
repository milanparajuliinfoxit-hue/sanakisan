const { asyncHandler } = require("../middlewares");
const { teamMemberServices } = require("../services");

const createTeamMember = asyncHandler(async (req, res, next) => {
  const feature_image = req.file.filename;

  const created_by = req.user.user_id;
  const teamData = req.body;

  const data = await teamMemberServices.postTeamMember(teamData, created_by, feature_image);
  if (data) {
    return res.status(200).json({
      status: true,
      message: "Team member created successfully."
    });
  }
  return res.status(200).json({
    status: false,
    message: "Couldn't create team member. Something went wrong."
  });
});


const getTeamMemberImage = asyncHandler(async (req, res, next) => {
  const imageName = req.params.image;
  if (!imageName) {
    return res.status(400).json({ error: 'Image name is required' });
  }

  const imagePath = path.join(__dirname, '..', '..', '..', 'public', 'uploads', imageName);

  // Check if the file exists
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: 'Image not found' });
    }
    fs.createReadStream(imagePath).pipe(res);  // Stream the file to the response
  });
});

const updateTeamMemberType = asyncHandler(async (req, res, next) => {
  const { TeamMemberId, publish_status } = req.body;

  await teamMemberServices.updateTeamMemberPublishStatus(TeamMemberId, publish_status);

  return res.status(201).json({
    status: true,
    message: `Team member has been type has been updated successfully!!!`
  });
});

const updateTeamMember = asyncHandler(async (req, res, next) => {

  let feature_image = "";
  if (req.file) {

    feature_image = req.file.filename;
  }
  const created_by = req.user.user_id;
  const teamData = req.body;

  const data = await teamMemberServices.updateTeamMember(teamData, created_by, feature_image);

  if (data) {
    return res.status(200).json({
      status: true,
      message: "Team member updated successfully."
    });
  }

  return res.status(200).json({
    status: false,
    message: "Team member be updated."
  });

});

const deleteTeamMember = asyncHandler(async (req, res, next) => { 
 
  const data = await teamMemberServices.deleteTeamMember(req.body);

  if (data) {
    return res.status(200).json({
      status: true,
      message: "TeamMember deleted successfully."
    });
  }

  return res.status(200).json({
    status: false,
    message: "TeamMember cannot be deleted."
  });

});

const getTeamMember = asyncHandler(async (req, res, next) => {
  const data = await teamMemberServices.getTeamMember(req.params.TeamMemberId);

  if (data) {
    return res.status(200).json({
      status: true,
      message: "Team member found successfully.",
      data: data
    });
  }

  return res.status(200).json({
    status: false,
    message: "Team member not found.",
    data: data
  });
});

const getTeamMemberPagination = asyncHandler(async (req, res, next) => {
  const {
    page,
    limit,
    publishedStatus,
    committee_type_id,
    committee_position_id,
  } = req.query;

  const filters = {};

  if (publishedStatus) {
    filters.status = publishedStatus;
  }

  if (committee_type_id) {
    filters.committee_type_id = committee_type_id;
  }

  if (committee_position_id) {
    filters.committee_position_id = committee_position_id;
  }

  const data = await teamMemberServices.getTeamMemberPagination(
    page,
    limit,
    filters
  );

  console.log(JSON.stringify(data.data, null, 2));

  return res.status(200).json({
    status: true,
    message: "Team Member found successfully.",
    data,
  });
});


module.exports = {
  createTeamMember,
  getTeamMemberImage,
  updateTeamMemberType,
  updateTeamMember,
  deleteTeamMember,
  getTeamMember,
  getTeamMemberPagination
};