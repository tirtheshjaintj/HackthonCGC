import { FaThumbsUp, FaFlag } from "react-icons/fa";

export default function HomeCard({ item, onUpvote, onFlag }) {
  return (
    <div className="cursor-pointer transition-all duration-300 bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-200 overflow-hidden max-w-sm">
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
            onClick={() => onUpvote?.(item)}
            className="flex items-center gap-1 text-sm text-[#272727] hover:text-blue-600"
          >
            <FaThumbsUp size={14} /> Upvote
          </button>
          <button
            onClick={() => onFlag?.(item)}
            className="flex items-center gap-1 text-sm text-[#272727] hover:text-red-600"
          >
            <FaFlag size={14} /> Flag
          </button>
        </div>
      </div>
    </div>
  );
}
