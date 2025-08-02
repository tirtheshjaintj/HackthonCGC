import { Router } from "express";
import reportRouter from "./report.route.js";
import userRouter from "./user.routes.js";
import utilRouter from "./util.route.js";

const homeRouter = Router();

homeRouter.use("/report", reportRouter);
homeRouter.use("/user", userRouter);
homeRouter.use("/util", utilRouter);

export default homeRouter;