import { Schema, model } from "mongoose";

const upvoteSchema = new Schema(
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
    },
    { timestamps: true }
);

// Ensure a user can upvote a post only once
upvoteSchema.index({ user_id: 1, report_id: 1 }, { unique: true });

const Upvote = model("Upvote", upvoteSchema);

export default Upvote;
