'use client';

import React, {ReactNode, useState} from "react";
import axios from "axios";
import Header from "@/app/(components)/Header";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [openingHour, setOpeningHour] = useState<number>(0);
  const [closingHour, setClosingHour] = useState<number>(0);
  const [numberOfTables, setNumberOfTables] = useState<number>(0);
  const today = new Date();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteRestaurantModalOpen, setIsDeleteRestaurantModalOpen] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState<Restaurant | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [reservationToDelete, setReservationToDelete] = useState<Reservation | null>(null);
  const [requestedToViewReservations, setRequestedToViewReservations] = useState(false);
  const [isDeleteReservationModalOpen, setIsDeleteReservationModalOpen] = useState(false);
  const [cells, setCells] = useState<ReactNode[]>([]);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdminPassword(event.target.value);
  };

  const handleListRestaurants = () => {
    setIsPasswordModalOpen(true);
  };

  const handleIsRestaurantActive = (bool: string) => {
    if (bool) {
      return "Active"
    } else {
      return "Inactive"
    }
  }

  const handleSubmitPassword = () => {
    setLoading(true);
    setError("");

    instance
        .post("/adminListRestaurants", {adminPass: adminPassword})
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
        .post("/adminListRestaurantReservations", {adminPass: adminPassword, restaurantID: id})
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
          adminPass: adminPassword,
          confirmation: reservationToDelete.confirmation,
          email: reservationToDelete.email,
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
  const handleAvailabilityReport = (restaurantID: number) => {
    instance.post('/adminGenerateAvailabilityReport', {
        "adminPass": adminPassword,
      "restaurantID": restaurantID,
      "day": today.toISOString().slice(0, 10)
    })
        .then(function (response) {
          // let status = response.data.statusCode
          const result = response.data.result;
          setOpeningHour(response.data.result.openingHour);
          setClosingHour(response.data.result.closingHour);
          setNumberOfTables(response.data.result.numberOfTables);
          console.log("Result: " + result);
          for (let i = openingHour; i <= closingHour; i++) {
            cells.push(
                <TableRow key={i}>
                  <TableCell key={i}>{i}:00</TableCell>
                  {result === "0"
                      ? Array.from({length: numberOfTables}, (_, j) => (
                          <TableCell className={`text-green-700`} key={j + 1}
                                     id={String(j + 1)}>Available</TableCell>
                      ))
                      : Array.from({length: numberOfTables}, (_, j) => {
                        const tableID = j + 1;
                        const tableData = result.find(
                            (item: {
                              tableID: number,
                              time: number
                            }) => item.tableID === tableID && item.time === i
                        );

                        return (
                            <TableCell key={`${i}-${tableID}`} id={String(tableID)}>
                              {tableData ? tableData.numberOfSeats : 'Available'}
                            </TableCell>
                        );
                      })
                  }
                </TableRow>
            );
          }
          setCells([...cells]);
          setIsDialogOpen(true);
        })
        .catch(function (error) {
          // this is a 500-type error, where there is no such API on the server side
          return error
        })
    // setVisible(true);
  }
  return (
      <>
        <Header hidden={false}/>
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
                    <div
                        key={restaurant.restaurantID}
                        className="border border-gray-300 rounded-lg p-4 mb-3 flex flex-col space-y-3"
                    >
                      {/* Restaurant Info Section */}
                      <div className="flex justify-between items-center">
                        {/* Restaurant Name and Address */}
                        <div className="flex flex-col space-y-1">
                          <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                          <h3 className="text-gray-600">{restaurant.address}</h3>
                        </div>

                        {/* Active Status */}
                        <div className="flex flex-col items-end">
                          <h3
                              className={`${
                                  restaurant.isActive === "Y"
                                      ? "text-green-600"
                                      : "text-red-600"
                              } font-semibold`}
                          >
                            {handleIsRestaurantActive(restaurant.isActive)}
                          </h3>
                        </div>
                      </div>

                      {/* Button Group */}
                      <div className="flex gap-3">
                        <button
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={() => {
                              setReservationToDelete(null);
                              setRestaurantToDelete(restaurant);
                              setIsDeleteRestaurantModalOpen(true);
                            }}
                        >
                          Delete
                        </button>
                          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                              <AlertDialogTrigger asChild>
                                  <button
                                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                      onClick={() => handleAvailabilityReport(Number(restaurant.restaurantID))}
                                  >
                                      Generate Availability Report
                                  </button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                  <AlertDialogHeader>
                                      <AlertDialogTitle>Availability Report</AlertDialogTitle>
                                  </AlertDialogHeader>
                                  <div className="text-sm text-muted-foreground mt-4">
                                      <Table>
                                          <TableHeader>
                                              <TableRow>
                                                  <TableHead className="text-black font-black">Time</TableHead>
                                                  {/* Add table headers dynamically */}
                                              </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                              {/* Add table rows dynamically */}
                                          </TableBody>
                                      </Table>
                                  </div>
                                  <AlertDialogFooter>
                                      <AlertDialogCancel>Close</AlertDialogCancel>
                                  </AlertDialogFooter>
                              </AlertDialogContent>
                          </AlertDialog>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={() => handleViewReservations(Number(restaurant.restaurantID))}
                        >
                          View Reservations
                        </button>
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
                    <div key={reservation.confirmation}
                         style={{border: '1px solid #ccc', padding: '10px', margin: '7px', borderRadius: '5px'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div>
                          <h3>{"Table ID: " + reservation.tableID}</h3>
                          <h3>{"Number Of Seats: " + reservation.numberOfSeats}</h3>
                          <h3>{"Confirmation Number: " + reservation.confirmation}</h3>
                          <h3>{"Date: " + String(reservation.day).substring(0, 10)}</h3>
                          <h3>{"Time: " + reservation.time}</h3>
                          <h3>{"Email: " + reservation.email}</h3>
                        </div>
                        <div style={{display: 'flex', gap: '10px'}}>
                          <button
                              className="px-4 py-2 bg-red-500 text-white rounded"
                              onClick={() => {
                                setRestaurantToDelete(null)
                                setReservationToDelete(reservation)
                                setIsDeleteReservationModalOpen(true)
                              }}
                          >
                            Delete
                          </button>

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