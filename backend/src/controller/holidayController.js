const { asyncHandler } = require("../middlewares");
const Holiday = require("../../models/Holiday");

// UPDATE
const updateHolidayDate = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { title, holidayDate } = req.body;

    if (!title || !holidayDate) {
      return res.json({ status: false, message: "All fields are required!" });
    }

    const holiday = await Holiday.findByPk(id);
    if (!holiday) return res.status(404).json({ status: false, message: "Holiday not found" });

    await holiday.update({ title, holiday_date: holidayDate });

    return res.status(200).json({ status: true, message: "Holiday updated successfully.", data: holiday });
  } catch (err) {
    return res.status(500).json({ status: false, message: "Server Error updating holiday" });
  }
});

// DELETE
const deleteHolidayDate = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const holiday = await Holiday.findByPk(id);
    if (!holiday) return res.status(404).json({ status: false, message: "Holiday not found" });

    await holiday.destroy();
    return res.status(200).json({ status: true, message: "Holiday deleted successfully." });
  } catch (err) {
    return res.status(500).json({ status: false, message: "Server Error deleting holiday" });
  }
});

// CREATE
const saveHolidayDate = asyncHandler(async (req, res) => {
  try {
    const { title, holidayDate } = req.body;

    if (!title || !holidayDate) {
      return res.json({
        success: false,
        message: "All fields are required!",
      });
    }

    const data = await Holiday.create({
      title,
      holiday_date: holidayDate,
    });

    return res.status(200).json({
      status: true,
      message: "Holiday created successfully.",
      data,
    });

  } catch (err) {
    console.log("error saving holiday date:", err);
    return res.status(500).json({
      status: false,
      message: "Server Error saving date",
    });
  }
});

// GET ALL
const getHolidayDates = asyncHandler(async (req, res) => {
    console.log("=== getHolidayDates route HIT ===");
  try {
    const data = await Holiday.findAll();

    return res.status(200).json({
      status: true,
      message: "Holidays fetched successfully",
      data,
    });

  } catch (err) {
    console.log("Error getting holidays!", err);

    return res.status(500).json({
      status: false,
      message: "Server Error getting dates",
    });
  }
});

module.exports = {
  saveHolidayDate,
  getHolidayDates,
  updateHolidayDate,
  deleteHolidayDate,
};