import Router from 'express'
import { deleteUser, loginUser, logoutUser, registerUser, updateAvatar, updateUser } from '../controller/user.controller.js';
import { verifyJWT } from '../middleware/userAuth.middleware.js';
import { upload } from '../middleware/multer.js'

const router = Router();
router.route("/registerUser").post(upload.fields([{ name: 'avatar', maxCount: 1 }]), registerUser);
router.route("/loginUser").post(loginUser);
router.route("/logoutUser").get(verifyJWT, logoutUser);
router.route("/updateUser").put(verifyJWT, updateUser);
router.route("/updateAvatar").post(verifyJWT, upload.fields([{ name: 'avatar', maxCount: 1 }]), updateAvatar);
router.route("/deleteUser").delete(verifyJWT, deleteUser);
export default router;