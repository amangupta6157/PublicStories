import express from "express";
import passport from "passport";
const authRouter = express.Router();

//descri: Auth with Google
//route: GET /auth/google

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile"] })
);

//descri: Google auth callback
//route: GET /auth/google/callback

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/dashboard",
    failureRedirect: "/",
  })
);

//@descri Logout User
//@route /auth/logout
authRouter.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
export default authRouter;
