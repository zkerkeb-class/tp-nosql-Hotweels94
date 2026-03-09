// Charger les variables d'environnement en PREMIER (avant tout autre import)
// dotenv lit le fichier .env et rend les variables accessibles via process.env
import "dotenv/config";

import express from "express";
import cors from "cors";
import pokemonsRoutes from "./routes/pokemons.js";
import authRoutes from "./routes/auth.js";
import favoritesRoutes from "./routes/favorites.js";
import connect from "./db/connect.js";

const app = express();
connect;

app.use(cors()); // Permet les requêtes cross-origin (ex: frontend sur un autre port)
app.use(express.json());
app.use(pokemonsRoutes);
app.use(authRoutes);
app.use(favoritesRoutes);
app.use("/assets", express.static("assets")); // Permet d'accéder aux fichiers dans le dossier "assets" via l'URL /assets/...

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Server is running on http://localhost:${process.env.PORT || 3000}`,
  );
});
