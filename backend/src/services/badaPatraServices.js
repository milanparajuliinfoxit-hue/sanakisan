const fs = require('fs');
const path = require('path');
const BadaPatra = require('../../models/BadaPatra');

const getPublicPath = (filename) =>
  path.resolve(__dirname, '../../../public', filename);

const deleteImageFile = (filename) => {
  if (!filename) return;
  try {
    const filePath = getPublicPath(filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch {
    // non-fatal — file may already be gone
  }
};

const getBadaPatra = async () => {
  return BadaPatra.findOne({ order: [['id', 'ASC']] });
};

const upsertBadaPatra = async (image, userId) => {
  const existing = await getBadaPatra();
  if (existing) {
    deleteImageFile(existing.image);
    await existing.update({ image, updated_by: userId });
    return existing;
  }
  return BadaPatra.create({ image, created_by: userId });
};

const updateBadaPatra = async (id, image, userId) => {
  const record = await BadaPatra.findByPk(id);
  if (!record) throw new Error('Bada Patra not found.');
  if (image) deleteImageFile(record.image);
  await record.update({
    ...(image && { image }),
    updated_by: userId,
  });
  return record;
};

const deleteBadaPatra = async (id) => {
  const record = await BadaPatra.findByPk(id);
  if (!record) throw new Error('Bada Patra not found.');
  deleteImageFile(record.image);
  await record.destroy();
  return true;
};

module.exports = {
  getBadaPatra,
  upsertBadaPatra,
  updateBadaPatra,
  deleteBadaPatra,
};
