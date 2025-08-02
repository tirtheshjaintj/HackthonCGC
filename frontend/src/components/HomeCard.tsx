import React from "react";
import { useNavigate, Link } from "react-router-dom";
 
export default function HomeCard({ value }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // if (!value.slug) return;
    // navigate(`/${value.slug}`);
  };

  return (
    <div
      title={value?.title}
      onClick={handleCardClick}
      className="border-[1px] relative cursor-pointer hover:drop-shadow-md transition-all duration-300
     bg-standard-bg-light dark:bg-standard-dark-bg-shade md:max-w-sm
      rounded-2xl border-gray-300 dark:border-stone-900 max-lg:min-w-[280px] lg:min-w-sm overflow-clip font-quicksand"
    >
      <img
        src={value?.images ?? "https://thumbs.dreamstime.com/b/beautiful-sun-rising-sky-asphalt-highways-road-rural-sce-scene-use-land-transport-traveling-background-backdrop-52532841.jpg"}
        alt="profile"
        className="aspect-[16/9] object-cover w-full"
        width={300}
        height={300}
        loading="lazy"
      />

      <div className="p-3.5 py-4">
        <div className="text-sm text-gray-800 dark:text-text-gray-shade-dark">
          <span className="text-theme-color dark:text-theme-dark-color mr-2 font-poppins font-semibold text-sm">
            Reported By: {value?.author?.name}
          </span>
          {/* {formatDate({ date: new Date(value.createdAt) })} */}
        </div>

        <Link to={`/${value?.slug}`}>
          <h2
            className="text-lg md:text-xl hover:opacity-90 text-ellipsis overflow-hidden line-clamp-2
         text-heading-color dark:text-theme-color-text-dark font-poppins font-semibold"
            onClick={(e) => e.stopPropagation()}
          >
            {value?.title}
          </h2>
        </Link>

        <p className="text-text-gray-shade dark:text-text-gray-shade-dark mt-2 text-sm text-ellipsis overflow-hidden line-clamp-3">
          {value?.metaDescription ?? value?.content.slice(0, 200)}
        </p>
      </div>

      <div
        className="flex items-center justify-between p-3.5 font-semibold text-stone-800
       absolute top-0 left-0 w-full"
      >
        <div className="flex-1 flex items-center gap-1.5">
          {value?.category.length > 0 &&
            value.category.slice(0, 2).map((item) => (
              <div
                key={item._id}
                className="bg-standard-bg-light dark:bg-standard-dark-bg-shade dark:text-theme-color-text-dark px-2 py-1 rounded-md text-xs"
              >
                {item.name.slice(0, 20)} {item.name.length > 20 && "..."}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
