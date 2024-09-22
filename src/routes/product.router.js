import { Router } from "express";
import { verifyJWT } from "../middleware/userAuth.middleware.js";
import { productDelete, productRegister, productUpdate } from "../controller/product.controller.js";
import { upload } from "../middleware/multer.js";


const router = Router()
router.route("/productRegister").post(verifyJWT, upload.fields([{ name: 'productImage', maxCount: 1 }, { name: "productFeaturesImages", maxCount: 2 }]), productRegister);
router.route("/productDelete").post(verifyJWT, productDelete)
router.route("/productUpdate").post(verifyJWT, productUpdate)
export default router