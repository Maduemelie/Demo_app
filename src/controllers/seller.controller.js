import Seller from "../models/seller.model";
import { OK, INTERNAL_SERVER_ERROR } from "../utils/constant";

export default class SellerController {
  static async getSellerDetails(req, res, next) {
    try {
      const sellerId = req.params.sellerId;

      const seller = await Seller.findById(sellerId);

      if (!seller) {
        return res.status(OK).json({
          status: false,
          message: "Seller not found",
        });
      }

      return res.status(OK).json({
        status: true,
        message: "Seller details",
        data: seller,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async contactSeller(req, res, next) {
    try {
      const sellerId = req.params.sellerId;
      const { message } = req.body;

      const seller = await Seller.findById(sellerId);

      if (!seller) {
        return res.status(OK).json({
          status: false,
          message: "Seller not found",
        });
      }

      return res.status(OK).json({
        status: true,
        message: "Offline contact initiated",
      });
    } catch (error) {
      return next(error);
    }
  }
}
