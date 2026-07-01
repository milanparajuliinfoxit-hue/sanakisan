const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const GalleryImage = require("../../models/GalleryImage");

const router = express.Router();

const uploadDir = path.join(__dirname, "../../src/public/uploads/gallery");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const { event } = req.body;
    const image_name = req.file.filename;
    const save_by = req.body.save_by || "admin";
    const status = "1";

    const saved = await GalleryImage.create({
      image_name,
      event,
      status,
      save_by,
    });
    res.json({ message: "Image uploaded successfully", data: saved });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { event } = req.query;
    const where = { status: "1" };
    if (event) where.event = event;

    const images = await GalleryImage.findAll({ where });
    res.json(
      images.map((img) => ({
        id: img.id,
        title: img.image_name,
        event: img.event,
        save_by: img.save_by,
        save_in: img.save_in,
      })),
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const image = await GalleryImage.findByPk(id);
    if (!image) return res.status(404).json({ error: "Image not found" });

    const filePath = path.join(uploadDir, image.image_name);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await GalleryImage.update({ status: "deleted" }, { where: { id } });
    res.json({ message: "Image deleted and marked as 'deleted'" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
