'use client';

import React, { useState, useEffect } from "react";
import Header from "@/app/(components)/Header";
import { Command, CommandInput } from "@/components/ui/command";
import Date from "@/app/(components)/Date";
import axios from "axios";

const instance = axios.create({
  baseURL: "https://8ng83lxa6k.execute-api.us-east-1.amazonaws.com/G2Iteration1",
});
export type Restaurant = {
  restaurantID: string;
  name: string;
  address: string;
  // Include any other properties your Restaurant object may have
};
export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    instance
        .get("/listActiveRestaurants")
        .then((response) => {
          const status = response.data.statusCode;
          if (status === 200) {
            setRestaurants(response.data.restaurants || []);
          } else {
            console.error("Failed to fetch restaurants. Status:", status);
            setError("Failed to load restaurants.");
          }
        })
        .catch((err) => {
          console.error("Error fetching restaurants:", err);
          setError("An error occurred while fetching data.");
        })
        .finally(() => {
          setLoading(false);
        });
  }, []);

  const handleRestaurantClick = (restaurantName: string) => {
    alert(`You selected: ${restaurantName}`);
    // Add navigation logic here
  };

  return (
      <>
        <Header />
        <div className="flex flex-col items-center justify-center gap-5">
          <div className="flex items-center gap-4 w-full max-w-4xl">
            <Date />
            <Command className="w-full">
              <CommandInput placeholder="Find restaurants ..." />
            </Command>
          </div>

          {/* Scrollable List */}
          <div className="mt-4 w-full max-w-4xl h-80 overflow-y-auto border border-gray-200 rounded-lg shadow">
            {loading && <p className="text-center">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {!loading &&
                !error &&
                restaurants.map((restaurant) => (
                    <div
                        key={restaurant.restaurantID} // Ensure to use a unique key
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