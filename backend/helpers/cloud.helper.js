import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Delete an image from Cloudinary using its public_id
 */
export const deleteFromCloud = (public_id) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(public_id, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
};

/**
 * Upload a file buffer to Cloudinary under the 'posts' folder
 */
const uploadToCloud = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "posts",
                resource_type: "image", // use "auto" if the file isn't always an image
            },
            (error, result) => {
                console.log(process.env.CLOUDINARY_CLOUD_NAME);
                console.log(error);

                if (error) return reject(error);
                if (result?.secure_url) {
                    resolve(result.secure_url);
                } else {
                    reject("No secure_url returned from Cloudinary.");
                }
            }
        );

        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
};

export default uploadToCloud;
