'use client';

import React, {useState, useEffect} from "react";
import Header from "@/app/(components)/Header";
import {Command, CommandInput} from "@/components/ui/command";
import axios from "axios";
import {Input} from "@/components/ui/input";
import DateCalendar from "@/app/(components)/Date";
import {Search} from "lucide-react";

const instance = axios.create({
    baseURL: "https://8ng83lxa6k.execute-api.us-east-1.amazonaws.com/G2Iteration1",
});

interface Restaurant {
    restaurantID: string;
    name: string;
    address: string;
}

export default function Home() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const today = new Date();
    const [day, setDay] = useState<Date | undefined>(undefined);
    const [time, setTime] = React.useState(-1);

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
                            placeholder="Find restaurants ..."
                            className={`pl-10 bg-white`}
                        />
                        <div className="absolute top-1/2 left-3 transform -translate-y-1/2">
                            <Search className="text-gray-500" size={20}/>
                        </div>
                    </div>
                </div>
                
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