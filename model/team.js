import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "L'utilisateur est obligatoire"],
  },
  name: {
    type: String,
    required: [true, "Le nom de l'équipe est obligatoire"],
    minlength: [1, "Le nom doit contenir au moins 1 caractère"],
    maxlength: [50, "Le nom ne peut pas dépasser 50 caractères"],
  },
  pokemons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pokemon",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Team = mongoose.model("Team", teamSchema);
export default Team;
