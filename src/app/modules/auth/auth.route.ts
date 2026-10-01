import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/login", AuthController.credentialLogin);
router.post("/refresh-token", AuthController.getNewAccessToken);
router.post("/logout", AuthController.logout);
router.post("/change-password", checkAuth(...Object.values(Role)), AuthController.changePassword);

export const AuthRoutes = router;
