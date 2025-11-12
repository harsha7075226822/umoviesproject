const { Schema, model } = require("mongoose");

const TrendingSchema = {
  id: { type: String, required: true },
  overview: { type: String, required: true },
  title: { type: String, required: true },
  backdrop_path: { type: String, required: true },
  poster_path: { type: String, required: true },
};

const TrendingmoviesSchema = new Schema(TrendingSchema);

const TrendingMoviesData = model("trendingmovies", TrendingmoviesSchema);

module.exports = { TrendingMoviesData };
