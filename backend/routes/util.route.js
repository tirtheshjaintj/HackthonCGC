import { Router } from "express";
import authcheck from "../middlewares/authcheck.js";
import { toggleFlag, toggleUpvote } from "../controllers/reportutil.controller.js";

const utilRouter = Router();

utilRouter.post("/upvote/:report_id", authcheck, toggleUpvote);
utilRouter.post("/flag/:report_id", authcheck, toggleFlag);

export default utilRouter;