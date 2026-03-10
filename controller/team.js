import Team from "../model/team.js";
import Pokemon from "../model/pokemon.js";

const formatValidationErrors = (error) => {
  if (error.errors) {
    const validationErrors = {};
    Object.keys(error.errors).forEach((field) => {
      validationErrors[field] = error.errors[field].message;
    });
    return validationErrors;
  }
  return { message: error.message };
};

export const createTeam = async (req, res) => {
  try {
    const { name, pokemons } = req.body;
    const userId = req.user._id;

    if (pokemons && pokemons.length > 6) {
      return res.status(400).json({
        erreurs: {
          pokemons: "Une équipe ne peut contenir que 6 Pokémon maximum",
        },
      });
    }

    let pokemonObjectIds = [];
    if (pokemons && pokemons.length > 0) {
      const validPokemons = await Pokemon.find({ id: { $in: pokemons } });
      if (validPokemons.length !== pokemons.length) {
        return res.status(400).json({
          erreurs: { pokemons: "Un ou plusieurs Pokémon introuvables" },
        });
      }
      pokemonObjectIds = validPokemons.map((p) => p._id);
    }

    const team = new Team({
      user: userId,
      name: name?.trim() || "",
      pokemons: pokemonObjectIds,
    });

    await team.save();
    await team.populate("pokemons");

    res.status(201).json(team);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        erreurs: formatValidationErrors(error),
      });
    }
    res.status(400).json({ erreur: error.message });
  }
};

export const getTeams = async (req, res) => {
  try {
    const userId = req.user._id;
    const teams = await Team.find({ user: userId })
      .populate("pokemons")
      .sort({ createdAt: -1 });

    res.json(teams);
  } catch (error) {
    res.status(500).json({ erreur: error.message });
  }
};

export const getTeamById = async (req, res) => {
  try {
    const teamId = req.params.id;
    const userId = req.user._id;

    const team = await Team.findById(teamId).populate("pokemons");

    if (!team) {
      return res.status(404).json({ erreur: "Équipe non trouvée" });
    }

    if (team.user.toString() !== userId.toString()) {
      return res.status(403).json({ erreur: "Accès refusé" });
    }

    res.json(team);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ erreur: "Équipe non trouvée" });
    }
    res.status(500).json({ erreur: error.message });
  }
};

export const updateTeam = async (req, res) => {
  try {
    const teamId = req.params.id;
    const userId = req.user._id;
    const { name, pokemons } = req.body;

    let team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ erreur: "Équipe non trouvée" });
    }

    if (team.user.toString() !== userId.toString()) {
      return res.status(403).json({ erreur: "Accès refusé" });
    }

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length === 0) {
        return res.status(400).json({
          erreurs: { name: "Le nom de l'équipe est obligatoire" },
        });
      }
      team.name = name.trim();
    }

    if (pokemons !== undefined) {
      if (!Array.isArray(pokemons)) {
        return res.status(400).json({
          erreurs: { pokemons: "Les Pokémon doivent être un tableau" },
        });
      }

      if (pokemons.length > 6) {
        return res.status(400).json({
          erreurs: {
            pokemons: "Une équipe ne peut contenir que 6 Pokémon maximum",
          },
        });
      }

      if (pokemons.length > 0) {
        const validPokemons = await Pokemon.find({ id: { $in: pokemons } });
        if (validPokemons.length !== pokemons.length) {
          return res.status(400).json({
            erreurs: { pokemons: "Un ou plusieurs Pokémon introuvables" },
          });
        }
        team.pokemons = validPokemons.map((p) => p._id);
      } else {
        team.pokemons = [];
      }
    }

    await team.save();
    await team.populate("pokemons");

    res.json(team);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        erreurs: formatValidationErrors(error),
      });
    }
    if (error.kind === "ObjectId") {
      return res.status(404).json({ erreur: "Équipe non trouvée" });
    }
    res.status(400).json({ erreur: error.message });
  }
};

export const deleteTeam = async (req, res) => {
  try {
    const teamId = req.params.id;
    const userId = req.user._id;

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ erreur: "Équipe non trouvée" });
    }

    if (team.user.toString() !== userId.toString()) {
      return res.status(403).json({ erreur: "Accès refusé" });
    }

    await Team.findByIdAndDelete(teamId);

    res.json({ message: "Équipe supprimée avec succès" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ erreur: "Équipe non trouvée" });
    }
    res.status(500).json({ erreur: error.message });
  }
};
