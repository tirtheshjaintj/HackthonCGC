import { Schema, model } from "mongoose";

const imageSchema = new Schema(
    {
        report_id: {
            type: Schema.Types.ObjectId,
            ref: "Report", // Should match the Report model
        },
        image_url: {
            type: String,
            required: [true, "Image URL is required"],
            trim: true,
            match: [/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/, "Invalid image URL"], // Optional validation
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Image = model("Image", imageSchema);

export default Image;
