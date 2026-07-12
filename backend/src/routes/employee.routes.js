import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { getEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee } from "../controllers/employee.controller.js";

const router = Router();

router.use(protect);

router.get("/", getEmployees);
router.get("/:id", getEmployeeById);
router.post("/", createEmployee);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;
