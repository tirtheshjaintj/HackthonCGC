import React, { useEffect, useState } from "react";
import NavBar from "../../../components/navbar/NavBar";
import HomeCard from "../../../components/HomeCard";
import MultiplePointsMap from "../../../components/LeafletMap/MultiplePointsMap";
import axiosInstance from "../../../axios/axiosConfig";

const sampleData = [
  {
    description: "Garbage not cleaned from last 3 days in Sector 22.",
    images: [
      "https://imgs.search.brave.com/okngA1KB1mYLHO2KIuH_buzzsjjXqfOf7VgQ0FMEgYE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTMz/NjY1MjUyMy9waG90/by9tb3VudGFpbi1y/b2FkLXdpdGgtZm9n/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz02NVF2U1h3bkhQ/NzVFZTZKcW0wUTdU/UlJ1dzhDTk1XbGFN/ZU0yRGVWX1c0PQ",
      "https://imgs.search.brave.com/lvP6MG5KGCls5zORoIYmA5weYv9DvdBJexMnkmAx3KQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAxMy8w/Ny8yNC8wMy8zMy9y/b2FkLTE2NjU0M182/NDAuanBn",
    ],
    latitude: "28.7041",
    longitude: "77.1025",
    category: {
      name: "Sanitation",
    },
    user_id:{
      username:"user1"
    }
  },
  {
    description: "Water leakage near community park.",
    images: [
      "https://imgs.search.brave.com/-bcqT-FDl64jWTmkSrYug9SXXAUg-NSiy15K5kKiOTY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAyLzMyLzAyLzQy/LzM2MF9GXzIzMjAy/NDIyOF8wNWMxSlVr/TlM3N2NVZGp2aHZ5/blhNcW9rYjBLYW9P/Ui5qcGc",
      "https://source.unsplash.com/600x400/?pipe,burst",
    ],
    latitude: "28.5355",
    longitude: "77.3910",
    category: {
      name: "Water Supply",
    },
  },
];

export default function HomePage() {
  const [reports, setReports] = useState([])
  const [mapPoints, setMapPoints] = useState([])
  useEffect(() => {
    const fetchReports = async () => {
      try {
        if (!navigator.geolocation) {
          console.error("Geolocation is not supported by your browser.");
          return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude  } = position.coords;

          const response = await axiosInstance.post("/report/nearby", {
            latitude,
            longitude,
          });
          console.log({response})
          const data = response.data.data;
          const flatteneddata = data.map((report)=>{
            return {
              id: report._id,
              description: report.description,
              category: {
                name: report.category_id?.name || "Uncategorized",
              },
              user_id: {
                username: report.user_id?.username || "Unknown",
              },
              images: report.images?.map(img => img.image_url) || [],
              status: report.status,
              latitude: report.latitude,
              longitude: report.longitude,
              upvote_count: report.upvote_count,
              flag_count: report.flag_count,
              createdAt: report.createdAt,
            };
          })

          const flatMapPoints = data.map((report)=>{
            return {
              id: report._id || index + 1, // fallback to index if _id not present
              latitude: (report.latitude),
              longitude:(report.longitude),
              title: report.category?.name || "Untitled",
              description: report.description || "No description provided"
            }
          })
          setMapPoints(flatMapPoints)

          console.log({flatMapPoints})

          setReports(flatteneddata);

          console.log("Reports fetched:", response.data);
        }, (error) => {
          console.error("Error fetching location:", error);
        });
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);
  return (
    <div>
      <NavBar />
      <div className="w-full" >

        <span className="text-2xl font-bold text-[#272727] p-2  m-2  px-auto" >All Reports Locations</span>
      </div>
        <div className="w-full h-[80vh] mt-3 z-[-1] overflow-hidden" >
          <MultiplePointsMap data={mapPoints} />
        </div>
      <main className="px-4 py-6 md:px-20 md:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((item, index) => (
          <HomeCard key={index} item={item} />
        ))}
      </main>
    </div>
  );
}
