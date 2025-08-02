import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { FaImage, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import usePageSetup from "../hooks/UsePageSetup";
import axiosInstance from "../axios/axiosConfig";

function CreateReport() {
    usePageSetup("Create New Report");

    const [reportDetails, setReportDetails] = useState({
        description: "",
        anonymous: false,
        category: "",
    });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imageFiles, setImageFiles] = useState([]);
    const [location, setLocation] = useState({
        lat: null,
        lng: null
    });
    const imagePreviews = useMemo(
        () => imageFiles.map((file) => URL.createObjectURL(file)),
        [imageFiles]
    );


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setReportDetails((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files || []);
        const newImages = [...imageFiles, ...files];

        if (newImages.length > 10) {
            toast.error(`Max 10 images allowed!`);
            return;
        }

        const allValidImages = newImages.every((file) =>
            file.type.startsWith("image/")
        );
        if (!allValidImages) {
            toast.error("Only image files are allowed!");
            e.target.value = "";
            return;
        }

        setImageFiles(newImages);
        e.target.value = "";
    };

    const removeImage = (index) => {
        const updatedImages = [...imageFiles];
        updatedImages.splice(index, 1);
        setImageFiles(updatedImages);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!location.lat || !location.lng) {
            toast.error("Please enable location access to submit the report.");
            return;
        }

        if (reportDetails.description.trim().length < 5) {
            toast.error("Description must be at least 5 characters!");
            return;
        }

        if (!reportDetails.category) {
            toast.error("Please select a category!");
            return;
        }

        if (imageFiles.length === 0) {
            toast.error("At least one image is required!");
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("description", reportDetails.description);
            formData.append("anonymous", reportDetails.anonymous);
            formData.append("category_id", reportDetails.category);
            formData.append("latitude", location.lat);
            formData.append("longitude", location.lng);

            imageFiles.forEach((file) => {
                formData.append("files", file);
            });

            await axiosInstance.post("/report", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Report Created Successfully!");
            setReportDetails({
                description: "",
                anonymous: false,
                category: "",
            });
            setImageFiles([]);
        } catch (err) {
            console.log(err);
            toast.error("Failed to submit the report.");
        } finally {
            setLoading(false);
        }
    };


    const getCategories = async () => {
        try {
            const response = await axiosInstance.get("/report/categories");
            setCategories(response.data.data);
        } catch (error) {
            console.log(error);
            toast.error("Error fetching Categoriess");
        }
    }

    useEffect(() => {
        getCategories();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    toast.error("Location access is required to submit a report.");
                    setLocation({ lat: null, lng: null }); // Clear if denied
                }
            );
        } else {
            toast.error("Geolocation not supported by this browser.");
        }
    }, []);

    const isLocationReady = location.lat !== null && location.lng !== null;


    return (
        <motion.div
            className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-lg rounded-2xl mt-8 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Create New Report
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">


                {/* Description */}
                <textarea
                    name="description"
                    value={reportDetails.description}
                    onChange={handleChange}
                    placeholder="Describe your report (min 5 characters)"
                    rows={4}
                    className="w-full p-3 rounded-lg border bg-white dark:bg-gray-800 text-black dark:text-white"
                />

                {/* Categories */}
                <select
                    name="category"
                    value={reportDetails.category}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border bg-white dark:bg-gray-800 text-black dark:text-white"
                >
                    <option value="">Select Category</option>
                    {categories.map((cat, idx) => (
                        <option key={idx} value={cat._id}>
                            {cat.name} ({cat.description})
                        </option>
                    ))}
                </select>
                {/* Anonymous */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="anonymous"
                        id="anonymous"
                        checked={reportDetails.anonymous}
                        onChange={handleChange}
                        className="w-5 h-5"
                    />
                    <label htmlFor="anonymous" className="text-gray-700 dark:text-gray-300">
                        Submit Anonymously
                    </label>
                </div>

                {/* Images */}
                <div>
                    <label className="block mb-2 text-gray-700 dark:text-gray-300">
                        Upload Images (Max 10)
                    </label>
                    <input
                        type="file"
                        onChange={handleImagesChange}
                        accept="image/*"
                        multiple
                        hidden
                        id="reportImages"
                    />
                    <div className="grid grid-cols-4 gap-2">
                        {/* Upload Trigger */}
                        <label
                            htmlFor="reportImages"
                            className="flex justify-center items-center border border-dashed border-gray-400 rounded-md aspect-square cursor-pointer"
                        >
                            <FaImage className="text-4xl text-gray-500" />
                        </label>

                        {/* Image Previews */}
                        {imagePreviews.map((preview, index) => (
                            <div
                                key={index}
                                className="relative w-full aspect-square overflow-hidden rounded-md"
                            >
                                <img
                                    src={preview}
                                    alt={`preview-${index}`}
                                    className="object-cover w-full h-full"
                                />
                                <div
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-black/70 p-1 rounded-full cursor-pointer text-white z-10"
                                >
                                    <FaTimes size={12} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={!isLocationReady || loading}
                    className="px-6 flex gap-2 py-3 float-right bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                    {loading ? <div className="spinner" ></div> : "Submit Report"}
                </button>
            </form>
        </motion.div>
    );
}

export default CreateReport;
