import { Schema, model } from "mongoose";

const historyLogsSchema = new Schema(
    {
        report_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Report",
        },
        action: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const HistoryLogs = model("HistoryLogs", historyLogsSchema);

export default HistoryLogs;