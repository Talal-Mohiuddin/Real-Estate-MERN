import { Router } from "express";
import { signUp,signIn,oauth, updateUser, deleteUser, signOut } from "../controllers/user.controller.js";
import { verifyuser } from "../middlewares/Auth.js";

const router = Router();


router.route('/signup').post(signUp)
router.route('/signin').post(signIn)
router.route('/oauth').post(oauth)
router.route('/update/:id').post(verifyuser,updateUser)
router.route('/delete/:id').delete(verifyuser,deleteUser)
router.route('/signout').get(verifyuser,signOut)


export default router;