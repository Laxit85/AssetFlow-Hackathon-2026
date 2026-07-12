import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { getAssets, getAssetById, createAsset, updateAsset, deleteAsset } from "../controllers/asset.controller.js";

const router = Router();

router.use(protect);

router.get("/", getAssets);
router.get("/:id", getAssetById);
router.post("/", createAsset);
router.put("/:id", updateAsset);
router.delete("/:id", deleteAsset);

export default router;
