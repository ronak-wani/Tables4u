'use client';

import React, { useState } from "react";
import Header from "@/app/(components)/Header";
import axios from "axios";

const instance = axios.create({
  baseURL: "https://8ng83lxa6k.execute-api.us-east-1.amazonaws.com/G2Iteration1",
});

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [adminPassword, setAdminPassword] = useState(""); 
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false); 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
  const [restaurantToDelete, setRestaurantToDelete] = useState(null); // Store restaurant to delete

  const handleRestaurantClick = (restaurant) => {
    setRestaurantToDelete(restaurant); // Set the clicked restaurant
    setIsDeleteModalOpen(true); // Open delete modal
  };

  const handlePasswordChange = (event) => {
    setAdminPassword(event.target.value);
  };

  const handleListRestaurants = () => {
    setIsPasswordModalOpen(true);
  };

  const handleSubmitPassword = () => {
    setLoading(true); 
    setError("");

    instance
      .post("/adminListRestaurants", { adminPass: adminPassword }) 
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

    setIsPasswordModalOpen(false);
  };

  const handleDeleteRestaurant = () => {
    setLoading(true);
    setError("");

    instance
      .post("/adminDeleteRestaurant", {
        name: restaurantToDelete.name,
        address: restaurantToDelete.address,
        adminPass: adminPassword,
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("Request was successful with status 200!");
          console.log(response.data); 
        }
      
        setRestaurants(restaurants.filter((restaurant) => restaurant.restaurantID !== restaurantToDelete.restaurantID));
        setIsDeleteModalOpen(false); 
        setAdminPassword(""); 
      })
      .catch((err) => {
        console.error("Error deleting restaurant:", err);
        setError("An error occurred while deleting the restaurant.");
        setIsDeleteModalOpen(false);// Close modal on error
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-5">
        {/* Button to List Restaurants */}
        <div className="mt-4">
          <button
            onClick={handleListRestaurants}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            List Restaurants (Admin Only)
          </button>
        </div>

        {/* Admin Access Key Input Modal */}
        {isPasswordModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-semibold">Enter Admin Access Key</h3>
              <input
                type="password"
                placeholder="Enter admin access key"
                value={adminPassword}
                onChange={handlePasswordChange}
                className="mt-2 p-2 border rounded w-full"
              />
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => setIsPasswordModalOpen(false)} 
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitPassword} 
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Restaurant Modal */}
        {isDeleteModalOpen && restaurantToDelete && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-semibold">Enter Admin Access Key to Delete</h3>
              <p>Are you sure you want to delete {restaurantToDelete.name}?</p>
              <input
                type="password"
                placeholder="Enter admin access key"
                value={adminPassword}
                onChange={handlePasswordChange}
                className="mt-2 p-2 border rounded w-full"
              />
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteRestaurant} 
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable List of Restaurants */}
        <div className="mt-4 w-full max-w-4xl h-80 overflow-y-auto border border-gray-200 rounded-lg shadow">
          {loading && <p className="text-center">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!loading && !error && restaurants.map((restaurant) => (
            <div
              key={restaurant.restaurantID} 
              className="flex flex-col p-4 border-b last:border-none hover:bg-red-100 cursor-pointer"
              onClick={() => handleRestaurantClick(restaurant)} 
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
