const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middlewares/authMiddleware");
const { getTopRated, getTrending, getOriginals, getPopular, getMovieById, searchMovies } = require("../controllers/movieController");

router.get("/movies-app/top-rated-movies", verifyToken, getTopRated);
router.get("/movies-app/trending-movies", verifyToken, getTrending);
router.get("/movies-app/originals", verifyToken, getOriginals);
router.get("/movies-app/popular-movies", verifyToken, getPopular);
router.get("/movies-app/movies/:movieId", verifyToken, getMovieById);
router.get("/movies-app/movies-search", verifyToken, searchMovies);

module.exports = router;
