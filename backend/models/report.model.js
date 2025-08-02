import { Schema, model } from "mongoose";

// Define the schema
const reportSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
            minlength: [5, "Description must be at least 5 characters long"],
        },
        anonymous: {
            type: Boolean,
            default: false,
            required: true
        },
        status: {
            type: Number,
            enum: [1, 2, 3],
            default: 1,
            required: [true, "Status is required"],
        },
        latitude: {
            type: Number,
            required: [true, "Latitude is required"],
            min: -90,
            max: 90,
        },
        longitude: {
            type: Number,
            required: [true, "Longitude is required"],
            min: -180,
            max: 180,
        },
        category_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Category"
        },
        images: [
            {
                type: Schema.Types.ObjectId,
                ref: "Image",
            }
        ],
        hidden:{
            type: Boolean,
            default: false
        },
        
    },
    {
        timestamps: true,
    }
);


// Create the model
const Report = model("Report", reportSchema);

export default Report;
