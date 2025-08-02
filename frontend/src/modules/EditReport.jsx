import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { FaImage, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import usePageSetup from "../hooks/UsePageSetup";
import axiosInstance from "../axios/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

function EditReport() {
    usePageSetup("Edit Report");
    const { report_id } = useParams();
    const [reportDetails, setReportDetails] = useState({
        description: "",
        anonymous: false,
        category: "",
    });

    const navigate = useNavigate();

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
    const [existingImages, setExistingImages] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const [deleting, setDeleting] = useState(false);



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

    const handleDeleteImage = async (imageId) => {
        const result = await Swal.fire({
            title: "Delete Image?",
            text: "Are you sure you want to delete this image?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                setDeleting(true);
                await axiosInstance.delete(`/report/image/${imageId}`);
                toast.success("Image deleted.");
                setExistingImages((prev) => prev.filter((img) => img._id !== imageId));
            } catch (err) {
                console.error(err);
                toast.error("Failed to delete image.");
            } finally {
                setDeleting(false);
            }
        }
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

        const totalImages = existingImages.length + imageFiles.length;
        if (totalImages === 0) {
            toast.error("At least one image is required!");
            return;
        }

        if (totalImages > 10) {
            toast.error("Maximum 10 images allowed!");
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

            // Append only new files
            imageFiles.forEach((file) => {
                formData.append("files", file);
            });

            await axiosInstance.post(`/report/edit/${report_id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Report updated successfully!");
            navigate("/my-reports");
        } catch (err) {
            console.log(err);
            toast.error("Failed to update the report.");
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
            toast.error("Error fetching Categories");
        }
    }
    const getReport = async () => {
        try {
            setIsFetching(true);
            const response = await axiosInstance.get(`/report/auth/id/${report_id}`);
            const data = response.data.data;

            setReportDetails({
                description: data.description || "",
                anonymous: data.anonymous || false,
                category: data.category_id?._id || "",
            });

            setExistingImages(data.images || []);
            setLocation({
                lat: data.latitude,
                lng: data.longitude,
            });

        } catch (error) {
            console.log(error);
            toast.error("Error fetching Report");
            navigate("/404");
        } finally {
            setIsFetching(false);
        }
    };
    const handleDeleteReport = async () => {
        const result = await Swal.fire({
            title: "Delete Report?",
            text: "This action is irreversible!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                setDeleting(true);
                await axiosInstance.delete(`/report/${report_id}`);
                toast.success("Report deleted successfully.");
                navigate("/my-reports");
            } catch (err) {
                console.error(err);
                toast.error("Failed to delete report.");
            } finally {
                setDeleting(false);
            }
        }
    };


    useEffect(() => {
        getCategories();
        getReport();
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
                Edit Report
            </h2>

            {isFetching ? (
                <div className="animate-pulse text-center py-10 text-gray-500 dark:text-gray-400">Loading report data...</div>
            ) : (<form onSubmit={handleSubmit} className="space-y-5">
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
                        Post  Anonymously
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
                        {/* Existing Image Previews */}
                        {existingImages.map((img, index) => (
                            <div
                                key={`existing-${index}`}
                                className="relative w-full aspect-square overflow-hidden rounded-md"
                            >
                                <img
                                    src={img.image_url}
                                    alt={`existing-${index}`}
                                    className="object-cover w-full h-full"
                                />
                                <div
                                    onClick={() => handleDeleteImage(img._id)}
                                    className="absolute top-1 right-1 bg-black/70 p-1 rounded-full cursor-pointer text-white z-10"
                                >
                                    {deleting ? (
                                        <div className="spinner"></div>
                                    ) : (
                                        <FaTimes size={12} />
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* New Image Previews */}
                        {imagePreviews.map((preview, index) => (
                            <div
                                key={`new-${index}`}
                                className="relative w-full aspect-square overflow-hidden rounded-md"
                            >
                                <img
                                    src={preview}
                                    alt={`new-preview-${index}`}
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
                {/* Delete Report Button */}
                <button
                    type="button"
                    onClick={handleDeleteReport}
                    disabled={deleting}
                    className="px-6 py-3 mt-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
                >
                    {deleting ? (
                        <div className="spinner"></div>
                    ) : (
                        "Delete Report"
                    )}
                </button>
                <button
                    type="submit"
                    disabled={!isLocationReady || loading}
                    className="px-6 flex gap-2 py-3 float-right bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                    {loading ? <div className="spinner" ></div> : "Submit Report"}
                </button>
            </form>
            )}
        </motion.div>
    );
}

export default EditReport;
