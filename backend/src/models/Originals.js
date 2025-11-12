const { Schema, model } = require("mongoose");

const OriginalsSchema = {
  id: { type: String, required: true },
  overview: { type: String, required: true },
  title: { type: String, required: true },
  backdrop_path: { type: String, required: true },
  poster_path: { type: String, required: true },
};

const OriginalMov = new Schema(OriginalsSchema);

const OriginalsData = model("originalsmovies", OriginalMov);

module.exports = { OriginalsData };
