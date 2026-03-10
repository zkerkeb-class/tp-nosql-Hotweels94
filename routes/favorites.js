import express from "express";
import * as favoriteController from "../controller/favorite.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/favorites", auth, favoriteController.getFavorites);

router.post("/favorites/:id", auth, favoriteController.createFavorite);

router.delete("/favorites/:id", auth, favoriteController.deleteFavorite);

export default router;
