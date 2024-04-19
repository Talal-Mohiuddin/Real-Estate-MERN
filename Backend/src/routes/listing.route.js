import { Router } from "express";
import { createListing } from "../controllers/listing.controller.js";
import { verifyuser } from "../middlewares/Auth.js";

const router = Router();



router.route('/create').post( verifyuser,createListing)





export default router;