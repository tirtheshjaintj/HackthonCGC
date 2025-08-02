import expressAsyncHandler from "express-async-handler";
import Report from "../models/report.model.js";
import Image from "../models/image.model.js";
import Category from "../models/category.model.js";
import userModel from "../models/user.model.js";
import { AppError } from "../helpers/error.helper.js";
import uploadToCloud from "../helpers/cloud.helper.js";
import Upvote from "../models/upvote.model.js";
import Flag from "../models/flag.model.js";

export const addCountsToReports = async (reports) => {
    // Convert to plain objects to allow new properties
    const plainReports = reports.map((r) => r.toObject());

    // Get counts for all reports in bulk
    const reportIds = plainReports.map((r) => r._id);

    const [upvoteCounts, flagCounts] = await Promise.all([
        Upvote.aggregate([
            { $match: { report_id: { $in: reportIds } } },
            { $group: { _id: "$report_id", count: { $sum: 1 } } },
        ]),
        Flag.aggregate([
            { $match: { report_id: { $in: reportIds } } },
            { $group: { _id: "$report_id", count: { $sum: 1 } } },
        ]),
    ]);

    // Convert to maps for fast lookup
    const upvoteMap = Object.fromEntries(upvoteCounts.map((u) => [u._id.toString(), u.count]));
    const flagMap = Object.fromEntries(flagCounts.map((f) => [f._id.toString(), f.count]));

    // Attach counts to each report
    return plainReports.map((report) => ({
        ...report,
        upvote_count: upvoteMap[report._id.toString()] || 0,
        flag_count: flagMap[report._id.toString()] || 0,
    }));
};
export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
    const toRad = (val) => (val * Math.PI) / 180;
    const R = 6371; // Radius of Earth in KM

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in KM
};


export const createReport = expressAsyncHandler(async (req, res) => {
    const { description, anonymous = false, latitude, longitude, category_id } = req.body;
    const userId = req.user?._id; // adapt for auth

    // Ensure at least 1 image and max 10
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ status: false, message: "At least one image is required" });
    }

    if (req.files.length > 10) {
        return res.status(400).json({ status: false, message: "Maximum 10 images allowed" });
    }

    // Create image documents
    const imageDocs = await Promise.all(
        req.files.map(async (file) => {
            return await Image.create({
                report_id: null, // will link after report is created
                image_url: await uploadToCloud(file.buffer), // or file.location if using S3
            });
        })
    );

    // Create the report with image IDs
    const report = await Report.create({
        user_id: userId,
        description,
        category_id,
        anonymous: anonymous || false,
        latitude,
        longitude,
        // images: imageDocs.map((img) => img._id),
    });

    // Update images with report_id reference
    await Promise.all(
        imageDocs.map((img) => {
            img.report_id = report._id;
            return img.save();
        })
    );

    res.status(201).json({
        status: true,
        message: "Report created successfully",
        data: report,
    });
});

export const getReportById = expressAsyncHandler(async (req, res) => {
    const { reportId } = req.params;
    const report = await Report.findById(reportId).populate("images").populate("category_id").populate("user_id");
    if (!report) throw new AppError("Report not found", 404);
    const reportsWithCounts = await addCountsToReports([report]);
    res.status(201).json({
        status: true,
        message: "Report Fetched",
        data: reportsWithCounts[0],
    });
});

export const editReport = expressAsyncHandler(async (req, res) => {
    const { reportId } = req.params;
    const { description, category_id } = req.body;
    const report = await Report.findOne({ _id: reportId, user_id: req.user?._id });
    if (!report) throw new AppError("Report not found", 404);

    // Update fields if provided
    if (description) report.description = description;
    if (category_id) report.category_id = category_id;

    /** -------------------
     * Handle image updates
     * -------------------*/
    if (req.files && req.files.length > 0) {
        const currentImagesCount = report.images.length;
        const newImagesCount = req.files.length;
        const totalImages = currentImagesCount + newImagesCount;

        // Max 10 images
        if (totalImages > 10) {
            return res.status(400).json({
                status: false,
                message: `Cannot upload ${newImagesCount} images. Maximum 10 images allowed per report.`,
            });
        }

        // Create new images
        const newImages = await Promise.all(
            req.files.map(async (file) =>
                Image.create({ report_id: report._id, image_url: await uploadToCloud(file.buffer) })
            )
        );

        // Add new image IDs to report
        report.images.push(...newImages.map((img) => img._id));
    }

    // Ensure at least 1 image remains

    if (report.images.length < 1) {
        return res.status(400).json({
            status: false,
            message: "Each report must have at least 1 image",
        });
    }

    await report.save();

    res.status(200).json({
        status: true,
        message: "Report updated successfully",
        data: report,
    });
});



export const getReports = expressAsyncHandler(async (req, res) => {
    const { latitude, longitude, distance = 5 } = req.body;
    const validDistance = [1, 3, 5];
    if (!validDistance.includes(distance)) throw new AppError("Not Valid Distance", 401);
    const reports = await Report.find().populate("images").populate("category_id").populate("user_id");
    const filteredReports = reports.filter((report) => {
        const d = calculateDistanceKm(latitude, longitude, report.latitude, report.longitude);
        return d <= distance;
    });
    const reportsWithCounts = await addCountsToReports(filteredReports);
    res.status(200).json({ status: true, count: filteredReports.length, data: reportsWithCounts });
});

export const myReports = expressAsyncHandler(async (req, res) => {
    const userId = req.user?._id || req.body.user_id;
    const reports = await Report.find({ user_id: userId })
        .populate("images")
        .populate("category_id")
        .sort({ createdAt: -1 });
    const reportsWithCounts = await addCountsToReports(reports);
    res.status(200).json({ status: true, count: reports.length, data: reportsWithCounts });
});


export const allReports = expressAsyncHandler(async (req, res) => {
    const reports = await Report.find().populate("images").populate("category_id").populate("user_id").sort({ createdAt: -1 });
    const reportsWithCounts = await addCountsToReports(reports);
    res.status(200).json({ status: true, count: reports.length, data: reportsWithCounts });
});


export const changeStatus = expressAsyncHandler(async (req, res) => {
    const { reportId } = req.params;
    const { status } = req.body;
    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ status: false, message: "Report not found" });
    if (status <= report.status) {
        return res.status(400).json({ status: false, message: "New status must be greater than current status" });
    }
    report.status = status;
    await report.save();

    res.status(200).json({ status: true, message: "Status updated successfully", data: report });
});

