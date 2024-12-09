'use client';

import React, {useState, useEffect} from "react";
import Header from "@/app/(components)/Header";
import axios from "axios";
import {Input} from "@/components/ui/input";
import DateCalendar from "@/app/(components)/Date";
import {Search} from "lucide-react";
import {useRouter} from "next/navigation";

const instance = axios.create({
    baseURL: "https://8ng83lxa6k.execute-api.us-east-1.amazonaws.com/G2Iteration1",
});

interface Restaurant {
    restaurantID: string;
    name: string;
    address: string;
}

export default function Home() {
    const router = useRouter();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tableID, setTableID] = useState(-1);
    const today = new Date();
    const [day, setDay] = useState<Date | undefined>(undefined);
    const [specificRestaurant, setSpecificRestaurant] = useState("");
    const [time, setTime] = React.useState(-1);
    const isFormValid:boolean = day !== undefined && time !== -1;

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                setLoading(true);
                if (!day) {
                    const response = await instance.get("/listActiveRestaurants");
                    const status = response.data.statusCode;

                    if (status === 200) {
                        setRestaurants(response.data.restaurants || []);
                        setError(null);
                    } else {
                        console.error("Failed to fetch restaurants. Status:", status);
                        setError("Failed to load restaurants.");
                    }
                } else {
                    // Check if restaurants are closed for the selected day
                    const response = await instance.post("/checkClosedDay", {
                        day: day.toISOString().slice(0, 10),
                    });
                    const { statusCode } = response.data;

                    if (statusCode === 200) {
                        setRestaurants(response.data.result || []);
                        setError(null);
                    } else {
                        console.error("Failed to fetch closed day restaurants. Status:", statusCode);
                        setError("Failed to load restaurants for the selected day.");
                        setRestaurants([]);
                    }
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("An error occurred while fetching data.");
                setRestaurants([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, [day]);

    const handleRestaurantClick = (restaurant:Restaurant) => {
        // instance.post('/checkClosedDay', {"restaurantID":restaurant.restaurantID, "day":day})
        //     .then(function (response) {
        //         const statusCode = response.data.statusCode;
        //         if(statusCode === 200 && response.data.result.canBook === true) {
                    instance.post('/findVacantTable', {"name":restaurant.name, "address":restaurant.address})
                        .then(function (response) {
                            // let status = response.data.statusCode
                            setTableID(response.data.result.tableID);
                            instance.post('/consumerFetchRestaurantDetails', {"name":restaurant.name, "address":restaurant.address, "tableID":tableID})
                                .then(function (response) {
                                    localStorage.clear();
                                    localStorage.setItem("name", response.data.result.restaurant[0].name);
                                    localStorage.setItem("address", response.data.result.restaurant[0].address);
                                    localStorage.setItem("tableID", response.data.result.restaurant[0].tableID);
                                    localStorage.setItem("tableSize", response.data.result.restaurant[0].numberOfSeats);
                                    localStorage.setItem("time", time.toString());
                                    localStorage.setItem("day", day? day.toISOString().slice(0, 10) : "");
                                    router.push(`/consumers/${restaurant.name}`);
                                })
                                .catch(function (error) {
                                    return error
                                })
                        })
                        .catch(function (error) {
                            return error
                        })
                // }
                // else{
                //     alert("The restaurant is closed for the given day.")
                // }
            // })
            // .catch(function (error) {
            //     return error
            // })
        // alert(`You selected: ${restaurantName}`);
    };
    const handleDay = (date: Date | undefined) => {
        if (date && date <= today) {
            alert("Invalid Date. Enter a date in the future.");
            setDay(undefined);
        } else {
            setDay(date);
        }
    };

    const handleTime = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = Number(e.target.value);
        if(newTime > 23 || newTime < 0){
            alert("Invalid Time. Enter a time valid in 24 hour format");
            e.target.value = "";
            setTime(Number(-1));
        }
        else{
            setTime(Number(newTime));
        }
    };

    const handleSpecificRestaurant = (e: React.ChangeEvent<HTMLInputElement>) => {
        // useEffect(() => {
        //     instance.post('/consumerSearchSpecificRestaurant', {"restaurantName":e.target.value, "day":day, "time":time})
        //         .then(function (response) {
        //             // let status = response.data.statusCode;
        //             // let resultComp = response.data.result;
        //         })
        //         .catch(function (error) {
        //             // this is a 500-type error, where there is no such API on the server side
        //             return error
        //         })
        // }, []);
        // if(){
        //     setSpecificRestaurant(e.target.value);
        // }
        // else{
        //     setSpecificRestaurant("");
        // }
    }

    return (
        <>
            <Header hidden={true}/>
            <div className="flex flex-col items-center justify-center gap-5">
                <div className="flex items-center gap-4 w-full max-w-4xl">
                    <DateCalendar selectedDate={day} onDateChange={handleDay}/>
                    <Input
                        type="number"
                        className={`w-1/2 bg-white`}
                        id="time"
                        placeholder="Pick a time"
                        onChange={handleTime}
                        required={true}
                    />
                    <div className="relative w-full max-w-md">
                        <Input
                            type="text"
                            id="restaurantName"
                            placeholder="Find restaurants ..."
                            className={`pl-10 bg-white`}
                            onChange={handleSpecificRestaurant}
                        />
                        <div className="absolute top-1/2 left-3 transform -translate-y-1/2">
                            <Search className="text-gray-500" size={20}/>
                        </div>
                    </div>
                </div>

                <div className="mt-4 w-full max-w-4xl overflow-y-auto border border-gray-200 rounded-lg shadow">
                    {loading && <p className="text-center">Loading...</p>}
                    {error && <p className="text-center text-red-500">{error}</p>}
                    {!loading && !error &&
                        // !error && specificRestaurant!=="" &&
                        restaurants.map((restaurant) => (
                            <div
                                key={restaurant.restaurantID} // Ensure to use a unique key
                                className={`flex flex-col p-4 border-b last:border-none ${
                                    !isFormValid ? "cursor-not-allowed" : "hover:bg-gray-200 cursor-pointer"
                                }`}
                                onClick={() => {
                                    if (isFormValid) handleRestaurantClick(restaurant);
                                    else alert("Please enter date and time");
                                }} >
                                    
                                <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                                <p className="text-sm text-gray-600">{restaurant.address}</p>
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
}