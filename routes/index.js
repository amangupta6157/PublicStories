import express from "express";
const router = express.Router();
import { ensureAuth, ensureGuest } from "../middleware/auth.js";
import Story from "../models/Story.js";

//descri: Login/Landing Page
//route: GET/

router.get("/", ensureGuest, (req, res) => {
  res.render("login", { layout: "login" });
});

//descri: Dashboard
//route: GET/dashboard

router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user.id }).lean();
    console.log(req.user.firstName);
    res.render("dashboard", {
      name: req.user.firstName,
      stories,
    });
  } catch (err) {
    console.log(err);
    res.render("error/500");
  }
});

export default router;
