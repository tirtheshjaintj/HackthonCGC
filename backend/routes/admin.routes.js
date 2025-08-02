import { adminLogin , adminRegister, banUser, getData } from "../controllers/admin.controller.js";
import { Router } from "express";
import { authcheckAdmin } from "../middlewares/authcheck.js";
const router = Router();

router.post("/login", adminLogin);
router.post("/register", adminRegister);
router.get('/ban/:userId' ,authcheckAdmin, banUser);
router.get('/data' , authcheckAdmin , getData);


export default router;