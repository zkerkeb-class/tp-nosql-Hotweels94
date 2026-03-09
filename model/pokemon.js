import mongoose from "mongoose";

const pokemonSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    english: { type: String },
    japanese: { type: String },
    chinese: { type: String },
    french: { type: String, required: true },
  },
  type: { type: [String], required: true },

  base: {
    HP: { type: Number, required: true },
    Attack: { type: Number, required: true },
    Defense: { type: Number, required: true },
    SpAttack: { type: Number },
    SpDefense: { type: Number },
    Speed: { type: Number },
  },
});

const Pokemon = mongoose.model("Pokemon", pokemonSchema);
export default Pokemon;
