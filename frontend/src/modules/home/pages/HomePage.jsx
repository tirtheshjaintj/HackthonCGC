import React from "react";
import NavBar from "../../../components/navbar/NavBar";
import HomeCard from "../../../components/HomeCard";

export default function HomePage() {
  return (
    <div>
      <NavBar />

      <main className="md:px-20 md:py-20 p-4 grid grid-cols-3 md-grid-cols-2 gap-4 grid-col-1">
        {[1, 2, 4, 2].map((_, index) => (
          <HomeCard key={index} />
        ))}
      </main>
    </div>
  );
}
