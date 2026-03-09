import Pokemon from "../model/pokemon.js";

export const getPokemons = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let type = req.query.type;
    let name = req.query.name;
    let sort = req.query.sort;
    let filter = {};

    let pokemons;

    if (type) {
      filter.type = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    }
    if (name) {
      filter.$or = [
        { "name.english": { $regex: name, $options: "i" } },
        { "name.french": { $regex: name, $options: "i" } },
        { "name.chinese": { $regex: name, $options: "i" } },
        { "name.japanese": { $regex: name, $options: "i" } },
      ];
    }
    if (sort) {
      const order = sort.startsWith("-") ? -1 : 1;
      const field = sort.startsWith("-") ? sort.slice(1) : sort;

      pokemons = await Pokemon.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ [field]: order });
      return res.json({
        pokemons: pokemons,
        total: await Pokemon.countDocuments(filter),
        page: page,
        limit: limit,
      });
    }
    pokemons = await Pokemon.find(filter).skip(skip).limit(limit);
    res.json({
      pokemons: pokemons,
      total: await Pokemon.countDocuments(filter),
      page: page,
      limit: limit,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPokemonById = async (req, res) => {
  try {
    const pokemon = await Pokemon.findOne({ id: req.params.id });
    if (!pokemon) {
      return res.status(404).json({ error: "Pokemon not found" });
    }
    res.json(pokemon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPokemon = async (req, res) => {
  try {
    const newPokemon = await Pokemon.create(req.body);
    res.status(201).json(newPokemon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updatePokemon = async (req, res) => {
  try {
    const updatedPokemon = await Pokemon.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true },
    );
    if (!updatedPokemon) {
      return res.status(404).json({ error: "Pokemon not found" });
    }
    res.json(updatedPokemon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deletePokemon = async (req, res) => {
  try {
    const deletedPokemon = await Pokemon.findOneAndDelete({
      id: req.params.id,
    });
    if (!deletedPokemon) {
      return res.status(404).json({ error: "Pokemon not found" });
    }
    res.json({ message: "Pokemon deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
