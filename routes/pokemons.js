import express from "express";
import * as pokemonController from "../controller/pokemon.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/pokemons", pokemonController.getPokemons);

router.get("/pokemon/:id", pokemonController.getPokemonById);

router.get("/stats", pokemonController.getStats);

router.post("/pokemon", auth, pokemonController.createPokemon);

router.put("/pokemon/:id", auth, pokemonController.updatePokemon);

router.delete("/pokemon/:id", auth, pokemonController.deletePokemon);

export default router;
