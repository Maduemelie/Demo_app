import { Router } from "express";

import AdController from "../controllers/ad.controller";

import { tryCatchHandler } from "../utils/catchAsync";

import auth from "../middlewares/auth";

const router = Router();

router
   .route("/ad")
   .post(auth, tryCatchHandler(AdController.createAd))
   .get(auth, tryCatchHandler(AdController.getAd));

router
   .route("/ad/:id")
   .get(auth, tryCatchHandler(AdController.getAdById))
   .put(auth, tryCatchHandler(AdController.updateAd))
   .delete(auth, tryCatchHandler(AdController.deleteAd));

export default router;
