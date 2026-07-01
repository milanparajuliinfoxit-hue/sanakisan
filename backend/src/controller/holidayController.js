const { asyncHandler } = require("../middlewares");
const Holiday = require("../../models/Holiday");

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
};