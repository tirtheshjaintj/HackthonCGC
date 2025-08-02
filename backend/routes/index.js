import { Router } from "express";
import reportRouter from "./report.route.js";

const homeRouter = Router();

homeRouter.use("/report", reportRouter);

export default homeRouter;