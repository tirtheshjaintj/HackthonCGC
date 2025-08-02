import { Router } from "express";
import reportRouter from "./report.route.js";
import userRouter from "./user.routes.js";

const homeRouter = Router();

homeRouter.use("/report", reportRouter);
homeRouter.use("/user", userRouter);

export default homeRouter;