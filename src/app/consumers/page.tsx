'use client'
import React from 'react'
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Header from "@/app/(components)/Header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useRouter } from "next/navigation";

const instance = axios.create({
    baseURL: 'https://8ng83lxa6k.execute-api.us-east-1.amazonaws.com/G2Iteration1'
});

type ReservationDetails = {
    email: string;
    confirmation: string;
    day: string;
    time: string;
    numberOfSeats: number;
};

export default function Consumer() {
    const router = useRouter();
    const [confirmation, setConfirmation] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [reservationDetails, setReservationDetails] = React.useState<ReservationDetails | null>(null);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleConfirmationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmation(e.target.value);
    };

    const fetchReservation = async () => {
        console.log('Fetching reservation for:', email, confirmation);
        try {
            const response = await instance.post('/consumerFetchReservation', { email, confirmation });
            const reservationData = JSON.parse(response.data.body).reservation; // Parse the body
            console.log('Parsed Reservation Data:', reservationData);
            setReservationDetails(reservationData);
            console.log("Reservation Details State Updated:", reservationData);

        } catch (error) {
            console.error("Error fetching reservation:", error);
            alert("Reservation not found. Please check your details.");
        }
    };
    
    
    

    const handleDelete = async () => {
        try {
            await instance.post('/consumerCancelReservation', { email, confirmation });
            alert("Reservation deleted successfully.");
            router.push("/");
        } catch (error) {
            console.error("Error deleting reservation:", error);
            alert("Error occurred while deleting reservation. Please try again.");
        }
    };

    return (
        <>
            <Header hidden={false}></Header>
            <div className="flex justify-center items-center h-full mt-64">
                <Card className="w-[600px]">
                    <CardHeader>
                        <CardTitle>Cancel Reservation</CardTitle>
                        <CardDescription>Enter your Email and Confirmation Code</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email <span style={{ color: 'red' }}>*</span></Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="abc@gmail.com"
                                    value={email}
                                    onChange={handleEmailChange}
                                    required={true}
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="confirmation">Confirmation Code <span style={{ color: 'red' }}>*</span></Label>
                                <Input
                                    id="confirmation"
                                    type="number"
                                    placeholder="1234"
                                    value={confirmation}
                                    onChange={handleConfirmationChange}
                                    required={true}
                                />
                            </div>
                        </div>
                    </CardContent>

                    {/* Reservation Details */}
                    {reservationDetails && (
                        <CardContent>
                            <div>   
                                <h4>Reservation Details:</h4>
                                <p><strong>Email:</strong> {reservationDetails.email}</p>
                                <p><strong>Confirmation Code:</strong> {reservationDetails.confirmation}</p>
                                <p><strong>Day:</strong> {new Date(reservationDetails.day).toLocaleDateString()}</p> {/* Format the date */}
                                <p><strong>Time:</strong> {reservationDetails.time}</p>
                                <p><strong>Seats:</strong> {reservationDetails.numberOfSeats}</p>
                            </div>
                        </CardContent>
                    )}


                    <CardFooter className="flex justify-between">
                        <Link href="/">
                            <Button variant="outline">Back</Button>
                        </Link>
                        {reservationDetails ? (
                            <Button onClick={handleDelete}>Delete Reservation</Button>
                        ) : (
                            <Button
                                disabled={confirmation === "" || email === ""}
                                onClick={fetchReservation}
                            >
                                Confirm
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}
