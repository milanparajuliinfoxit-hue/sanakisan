const GalleryImage = require("../../models/GalleryImage");

const postGalleryImage = async (data) => {
  const { image_name, status, save_by, save_in } = data;
  return await GalleryImage.create({ image_name, status, save_by, save_in });
};

const getAllGalleryImages = async () => {
  return await GalleryImage.findAll({ order: [['id', 'DESC']] });
};

module.exports = {
  postGalleryImage,
  getAllGalleryImages
};




