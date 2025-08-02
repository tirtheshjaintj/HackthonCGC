import React, { useEffect, useState } from "react";
import NavBar from "../../../components/navbar/NavBar";
import HomeCard from "../../../components/HomeCard";
import MultiplePointsMap from "../../../components/LeafletMap/MultiplePointsMap";
import axiosInstance from "../../../axios/axiosConfig";
import { Spin, Select } from "antd";

const { Option } = Select;

export default function HomePage() {
  const [reports, setReports] = useState([]);
  const [mapPoints, setMapPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState(5); // default distance

  const fetchReports = async (selectedDistance = distance) => {
    try {
      setLoading(true);

      if (!navigator.geolocation) {
        console.error("Geolocation is not supported by your browser.");
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          const response = await axiosInstance.post("/report/nearby", {
            latitude,
            longitude,
            distance: selectedDistance,
          });

          const data = response.data.data;

          const flattenedData = data.map((report) => ({
            id: report._id,
            description: report.description,
            category: {
              name: report.category_id?.name || "Uncategorized",
            },
            user_id: {
              username: report.user_id?.username || "Unknown",
            },
            images: report.images?.map((img) => img.image_url) || [],
            status: report.status,
            latitude: report.latitude,
            longitude: report.longitude,
            upvote_count: report.upvote_count,
            flag_count: report.flag_count,
            createdAt: report.createdAt,
          }));

          const flatMapPoints = data.map((report, index) => ({
            id: report._id || index + 1,
            latitude: report.latitude,
            longitude: report.longitude,
            title: report.category?.name || "Untitled",
            description: report.description || "No description provided",
          }));

          setMapPoints(flatMapPoints);
          setReports(flattenedData);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching location:", error);
          setLoading(false);
        }
      );
    } catch (error) {
      console.error("Error fetching reports:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDistanceChange = (value) => {
    setDistance(value);
    fetchReports(value);
  };

  return (
    <div>
      <NavBar />
      <div className="flex justify-between items-center px-4 md:px-20 py-4">
        <span className="text-2xl font-bold text-[#272727]">All Reports Locations</span>
        <Select
          value={distance}
          onChange={handleDistanceChange}
          className="w-28"
        >
          <Option value={1}>1 km</Option>
          <Option value={3}>3 km</Option>
          <Option value={5}>5 km</Option>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <Spin size="large" tip="Loading reports..." />
        </div>
      ) : (
        <>
          <div className="w-full h-[80vh] mt-3 z-[-1] overflow-hidden">
            <MultiplePointsMap data={mapPoints} />
          </div>

          <main className="px-4 py-6 md:px-20 md:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((item, index) => (
              <HomeCard key={index} item={item} />
            ))}
          </main>
        </>
      )}
      {
        !loading && reports.length === 0 && (
          <div className="flex justify-center items-center h-[60vh]">
            <span className="text-2xl font-bold text-[#272727]">No reports found</span>
          </div>
        )
      }
    </div>
  );
}
