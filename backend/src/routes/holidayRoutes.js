const express = require("express");

const {
  saveHolidayDate,
  getHolidayDates,
  updateHolidayDate,
  deleteHolidayDate,
} = require("../controller/holidayController");

const { validateHolidayPost } = require("../middlewares/validation/holidayValidation");

const holidayRoutes = express.Router();

holidayRoutes.post("/create-holiday", validateHolidayPost, saveHolidayDate);
holidayRoutes.get("/get-holidays", getHolidayDates);
holidayRoutes.put("/update-holiday/:id", updateHolidayDate);
holidayRoutes.delete("/delete-holiday/:id", deleteHolidayDate);

module.exports = holidayRoutes;