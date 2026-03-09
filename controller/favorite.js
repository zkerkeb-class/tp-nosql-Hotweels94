import Pokemon from "../model/pokemon.js";
import User from "../model/User.js";

export const getFavorites = async (req, res) => {
  try {
    const user = req.user;
    const favorites = await Pokemon.find({ _id: { $in: user.favorites } });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const pokemonId = req.params.id;

    if (!pokemonId) {
      return res.status(400).json({ error: "pokemonId is required" });
    }

    const pokemon = await Pokemon.findOne({ id: pokemonId });
    if (!pokemon) {
      return res.status(404).json({ error: "Pokemon not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: pokemon._id } },
      { new: true },
    ).populate("favorites");

    res.status(201).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const pokemonId = req.params.id;

    const pokemon = await Pokemon.findOne({ id: pokemonId });
    if (!pokemon) {
      return res.status(404).json({ error: "Pokemon not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { favorites: pokemon._id } },
      { new: true },
    ).populate("favorites");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "Favorite removed successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
