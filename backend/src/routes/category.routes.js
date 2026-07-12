import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from "../controllers/category.controller.js";

const router = Router();

router.use(protect);

router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
