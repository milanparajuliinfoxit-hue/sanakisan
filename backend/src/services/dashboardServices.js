const PressRelease = require('../../models/PressRelease');
const Notice = require('../../models/Notice');
const Event = require('../../models/Events');
const TeamMember = require('../../models/TeamMember');
const CommitteeType = require('../../models/CommitteeType');
const CommitteePosition = require('../../models/CommitteePosition');
const GalleryImage = require('../../models/GalleryImage');
const Holiday = require('../../models/Holiday');

const getDashboardStats = async () => {
  const [
    totalPressReleases,
    publishedPressReleases,
    totalNotices,
    activeNotices,
    totalEvents,
    totalMembers,
    totalCommitteeTypes,
    totalCommitteePositions,
    totalGalleryImages,
    totalHolidays,
  ] = await Promise.all([
    PressRelease.count({ where: { status: 1 } }),
    PressRelease.count({ where: { status: 1, publishStatus: 'published' } }),
    Notice.count({ where: { status: 1 } }),
    Notice.count({ where: { status: 1, publishStatus: 'published' } }),
    Event.count({ where: { status: 1 } }),
    TeamMember.count({ where: { status: 1 } }),
    CommitteeType.count({ where: { status: 1 } }),
    CommitteePosition.count({ where: { status: 1 } }),
    GalleryImage.count(),
    Holiday.count(),
  ]);

  return {
    pressReleases: { total: totalPressReleases, published: publishedPressReleases },
    notices: { total: totalNotices, active: activeNotices },
    events: { total: totalEvents },
    members: { total: totalMembers },
    committeeTypes: { total: totalCommitteeTypes },
    committeePositions: { total: totalCommitteePositions },
    gallery: { total: totalGalleryImages },
    holidays: { total: totalHolidays },
  };
};

module.exports = { getDashboardStats };
