const express = require("express");

const {
  saveHolidayDate,
  getHolidayDates,
} = require("../controller/holidayController");

const { validateHolidayPost } = require("../middlewares/validation/holidayValidation");

const holidayRoutes = express.Router();

holidayRoutes.post("/create-holiday", validateHolidayPost, saveHolidayDate);

holidayRoutes.get("/get-holidays", getHolidayDates);

module.exports = holidayRoutes;