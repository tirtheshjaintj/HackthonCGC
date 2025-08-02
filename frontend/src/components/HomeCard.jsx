import { FaThumbsUp, FaFlag } from "react-icons/fa";
import axiosInstance from "../axios/axiosConfig";
import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomeCard({ item }) {
  const [flagCount, setflagCount] = useState(item?.flag_count ?? 0);
  const [upvoteCount, setUpvoteCount] = useState(item?.upvote_count ?? 0);
  const navigate = useNavigate();
  const handleUpvote = async () => {
  try {
    const response = await axiosInstance.post(`/util/upvote/${item.id}`);
    const { data } = response.data;

    if (data === false) {
      setUpvoteCount(prev => prev + 1);
      toast.success("Upvoted Successfully");
    } else {
      setUpvoteCount(prev => Math.max(prev - 1, 0));
      toast.info("Upvote removed");
    }
  } catch (error) {
    console.error("Upvote error:", error);
  }
};

const handleFlag = async () => {
  try {
    const response = await axiosInstance.post(`/util/flag/${item.id}`);
    const { data } = response.data;

    if (data === false) {
      setflagCount(prev => prev + 1);
      toast.success("Flagged Successfully");
    } else {
      setflagCount(prev => Math.max(prev - 1, 0));
      toast.info("Flag removed");
    }
  } catch (error) {
    console.error("Flag error:", error);
  }
};

  return (
    <div onClick={()=>navigate(`/report/${item.id}`)} className="cursor-pointer transition-all duration-300 bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-200 overflow-hidden max-w-sm">
      <img
        src={item.images?.[0]}
        alt="report"
        className="w-full aspect-[16/9] object-cover"
      />

      <div className="p-4">
        <p className="text-sm text-[#272727] line-clamp-3 mb-3">
          {item.description || "No description provided."}
        </p>

        <div className="flex flex-wrap justify-between gap-2 text-xs mb-3">
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-full">
            {item.category?.name || "Uncategorized"}
          </span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 border border-blue-300 rounded-full">
            Reported by: {item.user_id?.username || "Unknown"}
          </span>
        </div>

        <div className="flex justify-between items-center mt-2">
          <button
            onClick={() => handleUpvote()}
            className="flex items-center gap-1 text-sm text-[#272727] hover:text-blue-600"
          >
            <FaThumbsUp size={14} /> {upvoteCount} Upvote
          </button>
          <button
            onClick={() => handleFlag()}
            className="flex items-center gap-1 text-sm text-[#272727] hover:text-red-600"
          >
            <FaFlag size={14} />{flagCount} Flag
          </button>
        </div>
      </div>
    </div>
  );
}
