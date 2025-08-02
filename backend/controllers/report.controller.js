import expressAsyncHandler from "express-async-handler";
import Report from "../models/report.model.js";
import Image from "../models/image.model.js";
import Category from "../models/category.model.js";
import userModel from "../models/user.model.js";
import { AppError } from "../helpers/error.helper.js";
import User from "../../../DhanRakshak/server/models/User.js";
import { sendEmail } from "../helpers/mail.helper.js";
import HistoryLogs from "../models/historylogs.model.js";

// utils/distance.js
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
  const {
    description,
    anonymous = false,
    latitude,
    longitude,
    category_id,
  } = req.body;
  const userId = req.user?._id || req.body.user_id; // adapt for auth

  // Ensure at least 1 image and max 10
  // if (!req.files || req.files.length === 0) {
  //     return res.status(400).json({ status: false, message: "At least one image is required" });
  // }

  // if (req.files.length > 10) {
  //     return res.status(400).json({ status: false, message: "Maximum 10 images allowed" });
  // }

  // Create image documents
  // const imageDocs = await Promise.all(
  //     req.files.map(async (file) => {
  //         return await Image.create({
  //             report_id: null, // will link after report is created
  //             image_url: file.path, // or file.location if using S3
  //         });
  //     })
  // );

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

  const user = userModel.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const history = await HistoryLogs.create({
    report_id: report._id,
    action: `Report created by ${user.name}`,
  })

  await sendEmail(
    "New Report Created",
    user.email,
    `Hello ${user.name || ""},

A new report has been successfully submitted on CivicTrack.

Report Details:
"${report.description}"

Thank you for helping us keep our community informed.

- CivicTrack Team`
  );
  // Update images with report_id reference
  // await Promise.all(
  //     imageDocs.map((img) => {
  //         img.report_id = report._id;
  //         return img.save();
  //     })
  // );

  res.status(201).json({
    status: true,
    message: "Report created successfully",
    data: report,
  });
});

export const editReport = expressAsyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const { description, latitude, longitude, category_id } = req.body;

  const report = await Report.findById(reportId);
  if (!report) throw new AppError("Report not found", 404);

  // Update fields
  if (description) report.description = description;
  if (latitude) report.latitude = latitude;
  if (longitude) report.longitude = longitude;
  if (category_id) report.category_id = category_id;

  // Optional: add new images
  if (req.files && req.files.length > 0) {
    if (req.files.length + report.images.length > 10) {
      return res
        .status(400)
        .json({ status: false, message: "Maximum 10 images allowed" });
    }

    const newImages = await Promise.all(
      req.files.map((file) =>
        Image.create({ report_id: report._id, image_url: file.path })
      )
    );

    report.images.push(...newImages.map((img) => img._id));
  }

  await report.save();

  res
    .status(200)
    .json({
      status: true,
      message: "Report updated successfully",
      data: report,
    });
});

export const getReports = expressAsyncHandler(async (req, res) => {
  const { latitude, longitude, distance = 3 } = req.body;
  const validDistance = [1, 3, 5];
  if (!validDistance.includes(distance))
    throw new AppError("Not Valid Distance", 401);
  const reports = await Report.find()
    .populate("images")
    .populate("category_id")
    .populate("user_id");

  const filteredReports = reports.filter((report) => {
    const d = calculateDistanceKm(
      latitude,
      longitude,
      report.latitude,
      report.longitude
    );
    return d <= distance;
  });

  res
    .status(200)
    .json({
      status: true,
      count: filteredReports.length,
      data: filteredReports,
    });
});

export const myReports = expressAsyncHandler(async (req, res) => {
  const userId = req.user?._id || req.body.user_id;
  const reports = await Report.find({ user_id: userId })
    .populate("images")
    .populate("category_id")
    .sort({ createdAt: -1 });
  res.status(200).json({ status: true, count: reports.length, data: reports });
});

export const allReports = expressAsyncHandler(async (req, res) => {
  const reports = await Report.find()
    .populate("images")
    .populate("category_id")
    .populate("user_id")
    .sort({ createdAt: -1 });
  res.status(200).json({ status: true, count: reports.length, data: reports });
});

export const changeStatus = expressAsyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const { status } = req.body;
  const report = await Report.findById(reportId);
  if (!report)
    return res.status(404).json({ status: false, message: "Report not found" });
  if (status <= report.status) {
    return res
      .status(400)
      .json({
        status: false,
        message: "New status must be greater than current status",
      });
  }
  report.status = status;
  await report.save();

  const user = await userModel.findById(report.user_id);

  
  const history = await HistoryLogs.create({
    report_id: report._id,
    action: `Report created by ${user.name}`,
  })

  let msg = "";

if (status === 2) {
  msg = "The report has been marked as 'In Progress'. Our team is actively working on it and it will be resolved soon.";
} else if (status === 3) {
  msg = "The report has been marked as 'Completed'. It is now visible to the public.";
}

await sendEmail(
  "Report Status Updated",
  report.user.email,
  `Hello ${user.name || "User"},

${msg}

Thank you for your contribution to CivicTrack.

– CivicTrack Team`
);


  res
    .status(200)
    .json({
      status: true,
      message: "Status updated successfully",
      data: report,
    });
});
