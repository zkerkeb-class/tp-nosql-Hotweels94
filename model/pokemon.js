import mongoose from "mongoose";

const ALLOWED_TYPES = [
  "Normal",
  "Fire",
  "Water",
  "Electric",
  "Grass",
  "Ice",
  "Fighting",
  "Poison",
  "Ground",
  "Flying",
  "Psychic",
  "Bug",
  "Rock",
  "Ghost",
  "Dragon",
  "Dark",
  "Steel",
  "Fairy",
];

const pokemonSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: [true, "L'ID du Pokémon est obligatoire"],
    unique: [true, "Un Pokémon avec cet ID existe déjà"],
    min: [1, "L'ID doit être un entier positif"],
    validate: {
      validator: Number.isInteger,
      message: "L'ID doit être un entier",
    },
  },
  name: {
    english: { type: String },
    japanese: { type: String },
    chinese: { type: String },
    french: {
      type: String,
      required: [true, "Le nom français est obligatoire"],
    },
  },
  type: {
    type: [String],
    required: [true, "Au moins un type est obligatoire"],
    validate: {
      validator: function (types) {
        if (!Array.isArray(types) || types.length === 0) {
          return false;
        }
        return types.every((t) => ALLOWED_TYPES.includes(t));
      },
      message: `Les types doivent faire partie de la liste autorisée : ${ALLOWED_TYPES.join(", ")}`,
    },
  },

  base: {
    HP: {
      type: Number,
      required: [true, "HP est obligatoire"],
      min: [1, "HP doit être entre 1 et 255"],
      max: [255, "HP doit être entre 1 et 255"],
    },
    Attack: {
      type: Number,
      required: [true, "Attack est obligatoire"],
      min: [1, "Attack doit être entre 1 et 255"],
      max: [255, "Attack doit être entre 1 et 255"],
    },
    Defense: {
      type: Number,
      required: [true, "Defense est obligatoire"],
      min: [1, "Defense doit être entre 1 et 255"],
      max: [255, "Defense doit être entre 1 et 255"],
    },
    SpAttack: {
      type: Number,
      min: [1, "SpAttack doit être entre 1 et 255"],
      max: [255, "SpAttack doit être entre 1 et 255"],
    },
    SpDefense: {
      type: Number,
      min: [1, "SpDefense doit être entre 1 et 255"],
      max: [255, "SpDefense doit être entre 1 et 255"],
    },
    Speed: {
      type: Number,
      min: [1, "Speed doit être entre 1 et 255"],
      max: [255, "Speed doit être entre 1 et 255"],
    },
  },
});

const Pokemon = mongoose.model("Pokemon", pokemonSchema);
export default Pokemon;
