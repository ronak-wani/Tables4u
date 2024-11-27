'use client';

import React from "react";
import Header from "@/app/(components)/Header";
import {
  Command,
  CommandInput,
} from "@/components/ui/command";
import Date from "@/app/(components)/Date";
import axios from "axios";


const instance = axios.create({
  baseURL: 'https://8ng83lxa6k.execute-api.us-east-1.amazonaws.com/G2Iteration1'
});

let resultComp = []
instance.get('/listActiveRestaurants', {})
            .then(function (response) {
                let status = response.data.statusCode;
                resultComp = response.data.restaurants;
                console.log(resultComp);
            })
            .catch(function (error) {
                // this is a 500-type error, where there is no such API on the server side
                return error
            })

const restaurants = [
  { id: 1, name: "Thai Time", address: "107 Highland St, Worcester, MA" },
  { id: 2, name: "The Boynton", address: "117 Highland St, Worcester, MA" },
  { id: 3, name: "Dragon Dynasty", address: "104 Highland St, Worcester, MA" },
  { id: 4, name: "Momo Palace", address: "160 Green St, Worcester, MA" },
  { id: 5, name: "Tech Pizza", address: "137 Highland St, Worcester, MA" },
  { id: 6, name: "Dunkin", address: "100 Institute Rd, Worcester, MA" },
];

export default function Home() {
  const handleRestaurantClick = (restaurantName: string) => {
    console.log(`You selected: ${restaurantName}`);
    // navigation logic 
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
          {resultComp.map((restaurant) => (
            <div
              key={restaurant.restaurantID}
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
