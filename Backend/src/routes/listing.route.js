import { Router } from "express";
import {
  createListing,
  getIndividualListing,
  editListing,
  getListing
} from "../controllers/listing.controller.js";
import { verifyuser } from "../middlewares/Auth.js";

const router = Router();

router.route("/create").post(verifyuser, createListing);
router.route("/editlisting/:id").post(verifyuser, editListing);
router.route("/getindividuallisting/:id").get(getIndividualListing);
router.route('/getlisting').get(getListing)

export default router;
