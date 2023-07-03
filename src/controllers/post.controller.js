import Post from "../models/post.model";
import { BAD_REQUEST, OK } from "../utils/constant";
import { createPostValidator } from "../validators/post.validator";
import { SellerController } from "../controllers/seller.controller";

export default class PostController {
  static async create(req, res, next) {
    try {
      const { error } = createPostValidator.validate(req.body);
      if (error) {
        return res.status(BAD_REQUEST).json({
          status: false,
          message: "There's a missing field in your input",
          error,
        });
      }
      let post = new Post({
        ...req.body,
        user: req.authId,
      });
      post = await post.save();
      return res.status(OK).json({
        status: true,
        message: "Post created successfully",
        data: post,
      });
    } catch (error) {
      return next(error);
    }
  }
  static async find(req, res, next) {
    try {
      return res.status(OK).json({
        status: false,
        message: "Find Posts",
      });
    } catch (error) {
      return next(error);
    }
  }
  static async findOne(req, res, next) {
    try {
      return res.status(OK).json({
        status: false,
        message: "Find one post",
      });
    } catch (error) {
      return next(error);
    }
  }

  static async update(req, res, next) {
    try {
      return res.status(OK).json({
        status: false,
        message: "Update post",
      });
    } catch (error) {
      return next(error);
    }
  }
  static async delete(req, res, next) {
    try {
      return res.status(OK).json({
        status: false,
        message: "Delete post",
      });
    } catch (error) {
      return next(error);
    }
  }

  //.............................Browse Items Section..............................

  //............................ User can filter Posts...........................
  static async filterPosts(req, res, next) {
    try {
      const likes = parseInt(req.query.likes);
      const limit = parseInt(req.query.limit) || 10;

      // Filter posts based on likes and limit the result
      const posts = await Post.find({ likes: { $gte: likes } }).limit(limit);

      return res.status(OK).json({
        status: true,
        message: "Filtered list of posts",
        data: posts,
      });
    } catch (error) {
      return next(error);
    }
  }

  //............................ User can browse a paginated list of all items on the platfrom...........................

  static async browsePosts(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const perPage = parseInt(req.query.perPage) || 10;

      const posts = await Post.find()
        .skip((page - 1) * perPage)
        .limit(perPage);

      return res.status(OK).json({
        status: true,
        message: "Paginated list of posts",
        data: posts,
      });
    } catch (error) {
      return next(error);
    }
  }

  //............................ User can search for posts on the platform using keywords...........................
  static async searchPosts(req, res, next) {
    try {
      const query = req.query.query;

      const keywords = query.split(",");

      const posts = await Post.find({ text: { $in: keywords } });

      return res.status(OK).json({
        status: true,
        message: "Search results",
        data: posts,
      });
    } catch (error) {
      return next(error);
    }
  }

  //............................ User can click on an item to open the post's detail page...........................
  static async getPost(req, res, next) {
    try {
      const postId = req.params.id;

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(NOT_FOUND).json({ message: "Post not found" });
      }
      return res.status(OK).json({
        status: true,
        message: "Post details",
        data: post,
      });
    } catch (error) {
      return next(error);
    }
  }

  //............................ User can sort items...........................
  static async sortPosts(req, res, next) {
    try {
      const sort = req.query.sort;

      const posts = await Post.find().sort(sort);

      return res.status(OK).json({
        status: true,
        message: "Sorted list of posts",
        data: posts,
      });
    } catch (error) {
      return next(error);
    }
  }

  //............................ User can see seller's contact details on the item detail page and can contact them offline...........................
  static async getSellerContactDetails(req, res, next) {
    try {
      const postId = req.params.id;

      const post = await Post.findById(postId).populate("seller");

      if (!post) {
        return res.status(OK).json({
          status: false,
          message: "Post not found",
        });
      }

      const sellerId = post.seller._id;

      const sellerDetails = await SellerController.getSellerDetails(sellerId);

      return res.status(OK).json({
        status: true,
        message: "Seller contact details",
        data: sellerDetails,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async contactSellerOffline(req, res, next) {
    try {
      const postId = req.params.id;
      const { message } = req.body;

      const post = await Post.findById(postId).populate("seller");

      if (!post) {
        return res.status(OK).json({
          status: false,
          message: "Post not found",
        });
      }
      const sellerId = post.seller._id;

      await SellerController.contactSeller(sellerId, message);

      return res.status(OK).json({
        status: true,
        message: "Offline contact initiated with the seller",
      });
    } catch (error) {
      return next(error);
    }
  }
}
