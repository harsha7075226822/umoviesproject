const { TopRatedMovies } = require("../models/TopRatedMovies");
const { TrendingMoviesData } = require("../models/TrendingMovies");
const { OriginalsData } = require("../models/Originals");
const { PopularMoviesData } = require("../models/Popular");
const { EachMovieData } = require("../models/EachMovieDetails");

const getTopRated = async (req, res) => {
  try {
    const topRated = await TopRatedMovies.find().lean();
    res.set("Cache-Control", "public, max-age=300, s-maxage=600");
    return res.status(200).json({ results: topRated, total: topRated.length });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const getTrending = async (req, res) => {
  try {
    const trendingData = await TrendingMoviesData.find().lean();
    res.set("Cache-Control", "public, max-age=300, s-maxage=600");
    return res.status(200).json({ data: trendingData, status: "SUCCESS" });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const getOriginals = async (req, res) => {
  try {
    const originals = await OriginalsData.find().lean();
    res.set("Cache-Control", "public, max-age=300, s-maxage=600");
    return res.status(200).json({ results: originals, total: originals.length });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const getPopular = async (req, res) => {
  try {
    const popular = await PopularMoviesData.find().lean();
    res.set("Cache-Control", "public, max-age=300, s-maxage=600");
    return res.status(200).json({ results: popular, length: popular.length });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const getMovieById = async (req, res) => {
  const movieId = req.params.movieId;
  try {
    const movieDetails = await EachMovieData.findOne({ id: movieId }).lean();
    if (!movieDetails) {
      return res.status(404).json({ message: "No Movie Found" });
    }
    res.set("Cache-Control", "public, max-age=300, s-maxage=600");
    return res.status(200).json({ movie_details: movieDetails });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const searchMovies = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search) {
      return res.status(400).json({ message: "Search query is required" });
    }
    const searchResults = await EachMovieData.find({ title: { $regex: search, $options: "i" } }).lean();
    res.set("Cache-Control", "public, max-age=60, s-maxage=120");
    return res.status(200).json({ results: searchResults, total: searchResults.length });
  } catch (error) {
    console.error("Search API Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getTopRated, getTrending, getOriginals, getPopular, getMovieById, searchMovies };
