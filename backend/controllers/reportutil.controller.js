import expressAsyncHandler from "express-async-handler";
import Flag from "../models/flag.model.js";
import { AppError } from "../helpers/error.helper.js";
import Report from "../models/report.model.js";
import Upvote from "../models/upvote.model.js";

export const toggleFlag = expressAsyncHandler(async (req, res) => {
    const { report_id } = req.params;
    const { reason = "" } = req.body;
    const user_id = req.user._id;

    const report = await Report.findOne({ _id: report_id });
    if (!report) throw new AppError("report not found", 404);
    const existingFlag = await Flag.findOne({ report_id, user_id });
    if (existingFlag) {
        await Flag.deleteOne({ _id: existingFlag._id });
        return res.json({ status: true, message: "Flag removed from report", data: false });
    } else {
        await Flag.create({ report_id, user_id, reason });

        const flags = await Flag.find({ report_id });
        if(flags.length >=5) {
            const report = await Report.findById(report_id);
            report.hidden = true;
            await report.save();
        }
        return res.json({ status: true, message: "report flagged successfully", data: true });
    }
});


export const toggleUpvote = expressAsyncHandler(async (req, res) => {
    const { report_id } = req.params;
    const user_id = req.user._id;

    // Check if report exists
    const report = await Report.findOne({ _id: report_id });
    if (!report) throw new AppError("Report not found", 404);

    // Check if already upvoted
    const existingUpvote = await Upvote.findOne({ report_id, user_id });
    if (existingUpvote) {
        // Remove upvote
        await Upvote.deleteOne({ _id: existingUpvote._id });
        return res.json({ status: true, message: "Upvote removed from report", data: false });
    } else {
        // Add upvote
        await Upvote.create({ report_id, user_id });
        return res.json({ status: true, message: "Report upvoted successfully", data: true });
    }
});
