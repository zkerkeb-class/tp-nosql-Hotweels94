import Pokemon from "../model/pokemon.js";
import connect from "./connect.js";
import fs from "fs";
import mongoose from "mongoose";

const seed = async () => {
  try {
    await connect;
    const data = fs.readFileSync("data/pokemons.json", "utf-8");
    const pokemons = JSON.parse(data);
    await Pokemon.deleteMany({});
    await Pokemon.insertMany(pokemons);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    mongoose.connection.close();
  }
};

seed();
