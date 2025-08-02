import { Schema, model } from "mongoose";

const flagSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        report_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Report",
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);


const Flag = model("Flag", flagSchema);

export default Flag;
