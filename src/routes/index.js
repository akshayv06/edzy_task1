const express = require("express");
const router = express.Router();

const crawlerRoutes = require("./crawlerRoutes");

router.use("/", crawlerRoutes);

module.exports = router;
