import React from "react";
import NavBar from "../../../components/navbar/NavBar";
import HomeCard from "../../../components/HomeCard";

export default function HomePage() {
  return (
    <div>
      <NavBar />

      <main className="p-4 md:px-20 md:py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 4, 2].map((_, index) => (
          <HomeCard key={index} />
        ))}
      </main>
    </div>
  );
}
