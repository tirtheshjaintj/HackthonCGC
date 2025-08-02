import { Router } from "express";
import { allReports, changeStatus, createReport, editReport, getReports, myReports } from "../controllers/report.controller.js";
import { createReportValidator } from "../validators/report.validator.js";
import validate from "../middlewares/validate.js";
import upload from "../middlewares/multer.js";

const reportRouter = Router();

reportRouter.post(
    "/",
    upload.array("images", 10), // max 10 images
    createReportValidator,
    validate,
    createReport
);

reportRouter.put("/edit/:reportId", upload.array("images", 10), editReport);
reportRouter.post("/nearby", getReports);
reportRouter.get("/my", myReports);
reportRouter.get("/all", allReports);
reportRouter.patch("/status/:reportId", changeStatus);

export default reportRouter;
