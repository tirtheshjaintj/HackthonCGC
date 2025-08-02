import React, { useEffect } from "react";
import NavBar from "../../components/navbar/NavBar";
import SinglePointMap from "../../components/LeafletMap/SinglePointMap";
import { useParams } from "react-router-dom";
import axiosInstance from "../../axios/axiosConfig";

const ReportDetails = () => {
    const {reportId} = useParams();

    const fetchLogs = async()=>{
        try {
            const response = await axiosInstance.get('/report/logs/' + reportId);
            console.log({response})
        } catch (error) {
            console.log("error :" , error);
        }
    }

    const fetchReport = async()=>{
        try {
            const response = await axiosInstance.get('/report/id/' + reportId);
            console.log({response});
        } catch (error) {
            console.log("error : " , error);
        }
    }


  return (
    <div className="min-h-screen bg-gray-50 text-[#272727]">
      {/* Navbar */}
      <NavBar/>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Map Placeholder */}
        <div className="w-full overflow-hidden h-64 bg-gray-300 rounded-2xl shadow-inner flex items-center justify-center text-gray-500 text-lg">
          
          <SinglePointMap/>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-2">Report Description</h2>
              <p className="text-gray-700">
                This report outlines a major infrastructure problem in Sector 12.
                The issue involves an open manhole that poses a danger to pedestrians and vehicles.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow space-y-4">
              <div>
                <span className="inline-block px-4 py-1 bg-blue-100 text-blue-800 border border-blue-300 rounded-full text-sm">
                  Status: In Progress
                </span>
              </div>
              <div>
                <span className="inline-block px-4 py-1 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-full text-sm">
                  Category: Infrastructure
                </span>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-3">Attached Images</h3>
              <div className="flex overflow-x-auto gap-4">
                {[1, 2, 3].map((img, idx) => (
                  <div
                    key={idx}
                    className="min-w-[120px] h-[80px] bg-gray-100 rounded-lg shadow-inner flex items-center justify-center text-gray-400"
                  >
                    Image {idx + 1}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-3">Action Logs</h3>
              <ul className="list-disc text-sm text-gray-600 space-y-2 pl-5">
                <li>Reported on 1 Aug, 2025 at 10:12 AM</li>
                <li>Assigned to municipal engineer</li>
                <li>Inspected on 2 Aug, 2025</li>
                <li>Work scheduled for 4 Aug, 2025</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetails;
