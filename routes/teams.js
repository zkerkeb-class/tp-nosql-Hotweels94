import express from "express";
import * as teamController from "../controller/team.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/teams", auth, teamController.createTeam);

router.get("/teams", auth, teamController.getTeams);

router.get("/teams/:id", auth, teamController.getTeamById);

router.put("/teams/:id", auth, teamController.updateTeam);

router.delete("/teams/:id", auth, teamController.deleteTeam);

export default router;
