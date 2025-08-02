import { adminLogin , adminRegister, banUser } from "../controllers/admin.controller.js";
import { Router } from "express";
const router = Router();

router.post("/login", adminLogin);
router.post("/register", adminRegister);
router.get('/ban/:userId' , banUser);

export default router;