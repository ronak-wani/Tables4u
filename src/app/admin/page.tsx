'use client';

import React, { useState } from "react";
import axios from "axios";

interface Restaurant {
  restaurantID: string;
  name: string;
  address: string;
  isActive: string;
}

interface Reservation {
  tableID: number;
  numberOfSeats: number;
  confirmation: number;
  day: string;
  time: number;
  email: string;
}

const instance = axios.create({
  baseURL: "https://8ng83lxa6k.execute-api.us-east-1.amazonaws.com/G2Iteration1",
});

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  let count = 0;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteRestaurantModalOpen, setIsDeleteRestaurantModalOpen] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState<Restaurant | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState<number>();
  const [timeValid, setTimeValid] = useState(false)
  const [restaurantName, setRestaurantName] = useState("");
  const [email, setEmail] = useState("");
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [reservationRestaurantID, setReservationRestaurantID] = useState<number>()
  const [reservationToDelete, setReservationToDelete] = useState<Reservation | null>(null);
  const [requestedToViewReservations, setRequestedToViewReservations] = useState(false);
  const [isDeleteReservationModalOpen, setIsDeleteReservationModalOpen] = useState(false);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdminPassword(event.target.value);
  };

  const handleListRestaurants = () => {
    setIsPasswordModalOpen(true);
  };

  const handleIsRestaurantActive = (bool: string) => {
    if(bool) {
      return "Restaurant is Active"
    }
    else{
      return "Restaurant is Inactive"
    }
  }

  const handleSubmitPassword = () => {
    setLoading(true);
    setError("");

    instance
      .post("/adminListRestaurants", { adminPass: adminPassword })
      .then((response) => {
        const status = response.data.statusCode;
        if (status === 200) {
          setRestaurants(response.data.restaurants as Restaurant[] || []);
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

  const handleViewReservations = (id: number) => {
    setRequestedToViewReservations(true)
    instance
      .post("/adminListRestaurantReservations", { adminPass: adminPassword, restaurantID: id })
      .then((response) => {
        const status = response.data.statusCode;
        if (status === 200) {
          setReservations(response.data.reservations as Reservation[] || []);
        } else {
          console.error("Failed to fetch Reservations. Status:", status);
          setError("Failed to load reservations.");
        }
      })
      .catch((err) => {
        console.error("Error fetching reservations:", err);
        setError("An error occurred while fetching data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const handleDeleteReservation = () => {
    if (!reservationToDelete) {
      setError("No restaurant selected for deletion.");
      return;
    }

    instance
      .post("/adminCancelReservation", {
        name: reservationToDelete.confirmation,
        address: reservationToDelete.email,
        adminPass: adminPassword,
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("Request was successful with status 200!");
          console.log(response.data);
          setReservations((prevReservations) =>
            prevReservations.filter((reservation) => reservation.confirmation !== reservationToDelete.confirmation)
          );
        }
        setIsDeleteReservationModalOpen(false);
        setAdminPassword("");
      })
      .catch((err) => {
        console.error("Error deleting reservation:", err);
        setError("An error occurred while deleting the reservation.");
        setIsDeleteReservationModalOpen(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDeleteRestaurant = () => {
    if (!restaurantToDelete) {
      setError("No restaurant selected for deletion.");
      return;
    }

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
          setRestaurants((prevRestaurants) =>
            prevRestaurants.filter((restaurant) => restaurant.restaurantID !== restaurantToDelete.restaurantID)
          );
        }
        setIsDeleteRestaurantModalOpen(false);
        setAdminPassword("");
      })
      .catch((err) => {
        console.error("Error deleting restaurant:", err);
        setError("An error occurred while deleting the restaurant.");
        setIsDeleteRestaurantModalOpen(false);
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
        {isDeleteRestaurantModalOpen && restaurantToDelete && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
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
                  onClick={() => setIsDeleteRestaurantModalOpen(false)}
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
          {!loading &&
            !error &&
            restaurants.map((restaurant) => (
              <div key={restaurant.restaurantID} style={{ border: '1px solid #ccc', padding: '10px', margin: '7px', borderRadius: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3>{restaurant.name}</h3>
                    <h3>{restaurant.address}</h3>
                  </div>
                  <div>
                    <h3>{handleIsRestaurantActive(restaurant.isActive)}</h3>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded"
                      onClick={() => {
                        setReservationToDelete(null)
                        setRestaurantToDelete(restaurant)
                        setIsDeleteRestaurantModalOpen(true)
                      }}
                    >
                      Delete</button>
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded"
                      onClick={() => handleViewReservations(Number(restaurant.restaurantID)) /*handleViewReservations(restaurant.restaurantID)*/}
                    >
                      View Reservations
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Scrollable List of Reservations */}
        <div className="mt-4 w-full max-w-4xl h-80 overflow-y-auto border border-gray-200 rounded-lg shadow">
          {loading && <p className="text-center">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!loading &&
            !error &&
            !(reservations.length === 0) &&
            reservations.map((reservation) => (
              <div key={reservation.confirmation} style={{ border: '1px solid #ccc', padding: '10px', margin: '7px', borderRadius: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3>{"Table ID: " + reservation.tableID}</h3>
                    <h3>{"Number Of Seats: " + reservation.numberOfSeats}</h3>
                    <h3>{"Confirmation Number: " + reservation.confirmation}</h3>
                    <h3>{"Date: " + String(reservation.day).substring(0, 10)}</h3>
                    <h3>{"Time: " + reservation.time}</h3>
                    <h3>{"Email: " + reservation.email}</h3>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded"
                      onClick={() => {
                        setRestaurantToDelete(null)
                        setReservationToDelete(reservation)
                        setIsDeleteReservationModalOpen(true)
                      }}
                    >
                      Delete</button>

                  </div>
                </div>


              </div>
            ))}

          {/* No Reservations Label */}
          {!loading &&
            !error &&
            (reservations.length === 0) &&
            requestedToViewReservations &&
            <h3 className="text-center text-red-500">No Reservations To Show</h3>
          }

          {/* Delete Reservation Modal */}
          {isDeleteReservationModalOpen && reservationToDelete && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                <h3 className="text-lg font-semibold">Confirm Deletion</h3>
                <p>Are you sure you want to delete reservation #{reservationToDelete.confirmation}?</p>
                <input
                  type="password"
                  placeholder="Enter admin access key"
                  value={adminPassword}
                  onChange={handlePasswordChange}
                  className="mt-2 p-2 border rounded w-full"
                />
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => setIsDeleteReservationModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteReservation}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}