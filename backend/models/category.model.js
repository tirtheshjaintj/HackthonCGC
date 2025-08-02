import { Schema, model } from "mongoose";

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            unique: true,
            trim: true,
            enum: [
                "Roads",
                "Lighting",
                "Water Supply",
                "Cleanliness",
                "Public Safety",
                "Obstructions",
            ],
        },
        description: {
            type: String,
            trim: true,
            default: "",
        },
        icon_url: {
            type: String,
            trim: true,
            match: [/^https?:\/\/.+\.(svg|png|jpg|jpeg|webp)$/, "Invalid icon URL"],
            default: null, // Optional icon for the app UI
        },
        active: {
            type: Boolean,
            default: true, // Allows disabling a category without deleting
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Category = model("Category", categorySchema);

export default Category;
