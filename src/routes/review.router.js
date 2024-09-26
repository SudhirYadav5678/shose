import { Router } from "express";
import { verifyJWT } from "../middleware/userAuth.middleware.js";
import { reviewAdd } from "../controller/review.controller.js";

const router = Router();
router.route("/reviewAdd").post(verifyJWT, reviewAdd)

export default router;