import React, { useEffect, useState } from "react";
import NavBar from "../../components/navbar/NavBar";
import SinglePointMap from "../../components/LeafletMap/SinglePointMap";
import { useParams } from "react-router-dom";
import axiosInstance from "../../axios/axiosConfig";

const ReportDetails = () => {
  const { reportId } = useParams();

<<<<<<< HEAD
  const fetchLogs = async () => {
    try {
      const response = await axiosInstance.get('/report/logs/' + reportId);
      console.log({ response })
    } catch (error) {
      console.log("error :", error);
    }
  }

  const fetchReport = async () => {
    try {
      const response = await axiosInstance.get('/report/id/' + reportId);
      console.log({ response });
    } catch (error) {
      console.log("error : ", error);
    }
  }
=======
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const response = await axiosInstance.get("/report/logs/" + reportId);
      const activityLogs = response.data.data.map((log) => log.action);
      setLogs(activityLogs);
    } catch (error) {
      console.log("error:", error);
    }
  };

  const fetchReport = async () => {
    try {
      const response = await axiosInstance.get("/report/id/" + reportId);
      console.log({response})
      const data = response.data.data;
      setDescription(data.description);
      setLatitude(data.latitude);
      setLongitude(data.longitude);
      setStatus(data.status);
      setCategory(data.category_id?.name ?? "Unknown");
      setImages(data.images?.map((img) => img.image_url) ?? []);
    } catch (error) {
      console.log("error:", error);
    }
  };
>>>>>>> c6b107eaeba7967acdf4625082735a6d3addba17

  useEffect(() => {
    if (reportId) {
      fetchLogs();
      fetchReport();
    }
  }, [reportId]);

  return (
    <div className="min-h-screen bg-gray-50 text-[#272727]">
<<<<<<< HEAD
      {/* Navbar */}
=======
>>>>>>> c6b107eaeba7967acdf4625082735a6d3addba17
      <NavBar />

      <div className="max-w-6xl mx-auto p-4 space-y-6">
<<<<<<< HEAD
        {/* Map Placeholder */}
        <div className="w-full overflow-hidden h-64 bg-gray-300 rounded-2xl shadow-inner flex items-center justify-center text-gray-500 text-lg">

          <SinglePointMap />
=======
        {/* Map */}
        <div className="w-full overflow-hidden h-64 bg-gray-300 rounded-2xl shadow-inner">
          {latitude && longitude ? (
            <SinglePointMap latitude={latitude} longitude={longitude} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-lg">
              Loading Map...
            </div>
          )}
>>>>>>> c6b107eaeba7967acdf4625082735a6d3addba17
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-2">Report Description</h2>
              <p className="text-gray-700">{description || "No description available."}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow space-y-4">
              <div>
                <span className="inline-block px-4 py-1 bg-blue-100 text-blue-800 border border-blue-300 rounded-full text-sm">
                  Status: {status === 1
                            ? "Reported"
                            : status === 2
                            ? "In Progress"
                            : status === 3
                            ? "Completed"
                            : "Unknown"}
                </span>
              </div>
              <div>
                <span className="inline-block px-4 py-1 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-full text-sm">
                  Category: {category}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-3">Attached Images</h3>
              {images.length > 0 ? (
                <div className="flex overflow-x-auto gap-4">
                  {images.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Report ${idx + 1}`}
                      className="min-w-[120px] h-[80px] object-cover rounded-lg shadow-inner"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No images attached.</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-3">Action Logs</h3>
              {logs.length > 0 ? (
                <ul className="list-disc text-sm text-gray-600 space-y-2 pl-5">
                  {logs.map((log, idx) => (
                    <li key={idx}>{log}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">No logs available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetails;
