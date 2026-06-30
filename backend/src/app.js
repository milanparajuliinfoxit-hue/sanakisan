const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
const logger = require("./config/winstonLoggerConfig");
const errorHandler = require("./utils/errorHandler");
const {
  NODE_ENV,
  REACT_APP_URL,
  REACT_ADMIN_APP_URL,
} = require("./config/constant");

const swaggerUi = require("swagger-ui-express");
const {
  authRoutes,
  teamRoutes,
  pressReleaseRoutes,
  noticeRoutes,
  eventRoutes,
  imageRoutes,
} = require("./routes");
const galleryRoutes = require("./routes/gallery");
const swaggerDocument = require("../swagger-output.json");
const holidayRoutes = require("./routes/holidayRoutes");

// CORS Options
const corsOptions = {
  origin: [
    REACT_APP_URL,
    REACT_ADMIN_APP_URL,
    "http://localhost:3000",
    "http://localhost:5173",
  ],
  credentials: true,
};

// Apply CORS and Security Middleware
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//CORP header for image  access issues
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});
// Serve public folder
app.use(express.static(path.join(__dirname, "../public")));

// Serve gallery images with proper CORS & cross-origin headers
app.use(
  "/api/getgalleryimage",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(__dirname, "../public/uploads/gallery")),
);

// API routes
app.use("/api", holidayRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", teamRoutes);
app.use("/api", pressReleaseRoutes);
app.use("/api", noticeRoutes);
app.use("/api", eventRoutes);
app.use("/api", imageRoutes);

// Swagger for dev
if (NODE_ENV === "development") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// Logging & error handling
app.use(errorHandler);
app.use((req, res) => {
  logger.info(req.url);
  res.status(404).json({ message: "Page not found !!!" });
});

module.exports = app;
