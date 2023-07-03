import Ad from "../models/ad.model";
import {
  createAdSchema,
  updateAdSchema,
  getAdSchema,
  deleteAdSchema,
} from "../validators/ad.validator.js";

export default class AdController {
  static async createAd(req, res) {
    try {
      const { error } = createAdSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const ad = new Ad(req.body);
      await ad.save();

      return res.status(201).json({ ad });
    } catch (error) {
      return res.status(500).json({ error: "Server error" });
    }
  }

  static async updateAd(req, res) {
    try {
      const { error } = updateAdSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const ad = await Ad.findByIdAndUpdate(req.params.adId, req.body, {
        new: true,
      });

      if (!ad) {
        return res.status(404).json({ error: "Ad not found" });
      }

      return res.status(200).json({ ad });
    } catch (error) {
      return res.status(500).json({ error: "Server error" });
    }
  }

  static async getAd(req, res) {
    try {
      const { error } = getAdSchema.validate(req.params);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const ad = await Ad.findById(req.params.adId);

      if (!ad) {
        return res.status(404).json({ error: "Ad not found" });
      }

      return res.status(200).json({ ad });
    } catch (error) {
      return res.status(500).json({ error: "Server error" });
    }
  }

  static async deleteAd(req, res) {
    try {
      const { error } = deleteAdSchema.validate(req.params);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const ad = await Ad.findByIdAndDelete(req.params.adId);

      if (!ad) {
        return res.status(404).json({ error: "Ad not found" });
      }

      return res.status(200).json({ message: "Ad deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Server error" });
    }
  }
}
