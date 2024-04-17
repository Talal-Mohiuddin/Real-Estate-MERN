import { Router } from "express";
import { signUp,signIn,oauth } from "../controllers/user.controller.js";

const router = Router();


router.route('/signup').post(signUp)
router.route('/signin').post(signIn)
router.route('/oauth').post(oauth)


export default router;