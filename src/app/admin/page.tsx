'use client';

import React from "react";
import {
  Command,
  CommandInput,
} from "@/components/ui/command";
import Date from "@/app/(components)/Date";

const restaurants = [
  { id: 1, name: "Thai Time", address: "107 Highland St, Worcester, MA" },
  { id: 2, name: "The Boynton", address: "117 Highland St, Worcester, MA" },
  { id: 3, name: "Dragon Dynasty", address: "104 Highland St, Worcester, MA" },
  { id: 4, name: "Momo Palace", address: "160 Green St, Worcester, MA" },
  { id: 5, name: "Tech Pizza", address: "137 Highland St, Worcester, MA" },
];

export default function Home() {
  const handleRestaurantClick = (restaurantName: string) => {
    alert(`You selected: ${restaurantName}`);
    // navigation logic 
  };

  return (
    <> 
      <div className="flex flex-col items-center justify-center gap-5">
        <div className="flex items-center gap-4 w-full max-w-4xl">
          <Command className="w-full">
            <CommandInput placeholder="Find restaurants ..." />
          </Command>
        </div>

        {/* Scrollable List */}
        <div className="mt-4 w-full max-w-4xl h-80 overflow-y-auto border border-gray-200 rounded-lg shadow">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="flex flex-col p-4 border-b last:border-none hover:bg-gray-100 cursor-pointer"
              onClick={() => handleRestaurantClick(restaurant.name)}
            >
              <h3 className="text-lg font-semibold">{restaurant.name}</h3>
              <p className="text-sm text-gray-600">{restaurant.address}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
