import { Router } from "express";

import PostController from "../controllers/post.controller";
import { tryCatchHandler } from "../utils/catchAsync.js";
import auth from "../middlewares/auth";

const router = Router();

router
  .route("/posts")
  .post(auth, tryCatchHandler(PostController.create))
  .get(auth, tryCatchHandler(PostController.find));

router
  .route("/posts/:id")
  .get(auth, tryCatchHandler(PostController.findOne))
  .put(auth, tryCatchHandler(PostController.update))
  .delete(auth, tryCatchHandler(PostController.delete));

  
// Filter posts
router.get("/filter", auth, PostController.filterPosts);

// Browse posts
router.get("/browse", auth, PostController.browsePosts);

// Search posts
router.get("/search", auth, PostController.searchPosts);

// Get post details
router.get("/:id", auth, PostController.getPost);

// Sort posts
router.get("/sort", auth, PostController.sortPosts);

router
  .route("/posts/:id/seller/contact")
  .get(auth, tryCatchHandler(PostController.getSellerContactDetails))
  .post(auth, tryCatchHandler(PostController.contactSellerOffline));

export default router;
