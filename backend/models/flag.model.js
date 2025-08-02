import { Schema, model } from "mongoose";

const flagSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        report_id: {
            type: Schema.Types.ObjectId,
            ref: "Report",
            required: true,
        },
        reason: {
            type: String,
            trim: true,
            default: "",
        },
    },
    { timestamps: true }
);

// Ensure a user can flag a post only once
flagSchema.index({ user_id: 1, report_id: 1 }, { unique: true });

const Flag = model("Flag", flagSchema);

export default Flag;
