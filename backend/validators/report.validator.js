import { body } from "express-validator";

export const createReportValidator = [
    body("description")
        .isString()
        .isLength({ min: 5 })
        .withMessage("Description must be at least 5 characters long"),
    body("latitude")
        .isFloat({ min: -90, max: 90 })
        .withMessage("Latitude must be between -90 and 90"),
    body("longitude")
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude must be between -180 and 180"),
];
