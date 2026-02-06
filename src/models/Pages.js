const mongoose = require("mongoose");

const PageSchema = new mongoose.Schema({
  url: { type: String, unique: true, index: true },

  html: { type: String },

  outgoingLinks: [
    {
      url: String,
      type: { type: String, enum: ["internal", "external"] }
    }
  ],

  incomingLinks: [{ type: String }], // store URLs linking to this page

  crawledAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Page", PageSchema);
