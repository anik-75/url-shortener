const mongoose = require("mongoose");

const shorurlSchema = new mongoose.Schema({
  original_url: {
    type: String,
    required: true,
    // unique: true,
  },
  short_url: {
    type: String,
  },
});

const Shorturl = mongoose.model("Shorturl", shorurlSchema);

module.exports = Shorturl;
