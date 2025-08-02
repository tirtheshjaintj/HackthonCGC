import { Router } from "express";
import { allReports, changeStatus, createReport, editReport, getCategories, getReportById, getReports, myReports } from "../controllers/report.controller.js";

import { createReportValidator } from "../validators/report.validator.js";
import validate from "../middlewares/validate.js";
import upload from "../middlewares/multer.js";
import authcheck, { authcheckAdmin } from "../middlewares/authcheck.js";

const reportRouter = Router();

reportRouter.post(
    "/",
    upload.array("files", 10), // max 10 images
    createReportValidator,
    validate,
    authcheck,
    createReport
);

reportRouter.post("/edit/:reportId", upload.array("files", 10), authcheck, editReport);
reportRouter.post("/nearby", getReports);
reportRouter.get("/categories", getCategories);
reportRouter.get("/my", authcheck, myReports);
reportRouter.get("/id/:reportId", getReportById);

//Admin Ones
reportRouter.get("/all", authcheckAdmin, allReports);
reportRouter.post("/status/:reportId", authcheckAdmin, changeStatus);

reportRouter.get('/logs/:reportId', getLogs);

export default reportRouter;
