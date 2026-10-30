import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";
import {
  getWatchlist,
  addMovie,
  updateMovie,
  deleteMovie,
} from "../utils/db.js";

const router = Router();

router.use(authenticate);

router.get("/:userId", (req, res) => {
  try {
    const list = getWatchlist(Number(req.params.userId));
    if (!list) {
      return res.status(404).json({ error: "Watchlist not found." });
    }
    res.status(200).json(list);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.post("/:userId/movies", authorizeModification, (req, res) => {
  try {
    const movie = addMovie(Number(req.params.userId), req.body);
    res.status(201).json(movie);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  try {
    const movie = updateMovie(
      Number(req.params.userId),
      Number(req.params.movieId),
      req.body,
    );
    if (!movie) {
      return res.status(404).json({ error: "Movie not found." });
    }
    res.status(200).json(movie);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.delete(
  "/:userId/movies/:movieId",
  authorizeModification,
  (req, res) => {
    try {
      const movie = deleteMovie(
        Number(req.params.userId),
        Number(req.params.movieId),
      );
      if (!movie) {
        return res.status(404).json({ error: "Movie not found." });
      }
      res.status(200).json(movie);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },
);

export default router;