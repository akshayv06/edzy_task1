const express = require("express");
const connectDB = require("./config/db");
const crawlerRoutes = require("./routes/crawlerRoutes");

const app = express();
connectDB();

app.use(express.json());
app.use("/api", crawlerRoutes);

module.exports = app;
