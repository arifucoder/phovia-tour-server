import { Router } from "express";
import passport from "passport";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/login", AuthController.credentialLogin);
router.post("/refresh-token", AuthController.getNewAccessToken);
router.post("/logout", AuthController.logout);
router.post("/change-password", checkAuth(...Object.values(Role)), AuthController.changePassword);
router.post("/set-password", checkAuth(...Object.values(Role)), AuthControllers.setPassword);
//  /booking -> /login -> succesful google login -> /booking frontend
// /login -> succesful google login -> / frontend
router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
	const redirect = req.query.redirect || "/";
	passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next);
}); // eta te error dekhacche sync theke req, res, next and then query te ? eta dile thik hocche

// api/v1/auth/google/callback?state=/booking
router.get(
	"/google/callback",
	passport.authenticate("google", { failureRedirect: "/login" }),
	AuthController.googleCallbackController,
);

export const AuthRoutes = router;
