import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { getDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment } from "../controllers/department.controller.js";

const router = Router();

router.use(protect);

router.get("/", getDepartments);
router.get("/:id", getDepartmentById);
router.post("/", createDepartment);
router.put("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);

export default router;
