'use client'
import React, {useEffect} from 'react';
import Header from "@/app/(components)/Header";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {Button} from "@/components/ui/Button";
import {useState} from "react";
import axios from "axios";
import {Copy} from "lucide-react";

const instance = axios.create({
    baseURL: 'https://8ng83lxa6k.execute-api.us-east-1.amazonaws.com/G2Iteration1'
});

export default function MakeReservation() {
    const [isNotInvisible, setNotInvisible] = React.useState(true);
    const [email, setEmail] = useState("");
    const [partySize, setPartySize] = useState(0);
    const [tableSize, setTableSize] = useState(0);
    const [date, setDate] = useState<string | null>(null);
    const [time, setTime] = useState(0);
    const [tableID, setTableID] = useState(0);
    const [name, setName] = useState<string | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const isFormValid:boolean = email.trim() !== "" && partySize !== 0;
    const [confirmationNumber, setConfirmationNumber] = React.useState(-1);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setName(localStorage.getItem("name"));
            setAddress(localStorage.getItem("address"));
            setTableID(Number(localStorage.getItem("tableID")));
            setTableSize(Number(localStorage.getItem("tableSize") || 1));
            setDate(localStorage.getItem("day"));
            setTime(Number(localStorage.getItem("time") || "NaN"));
        }
    }, []);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePartySizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPartySize = Number(e.target.value);
        if (newPartySize > tableSize) {
            alert(`Maximum number of seats allowed is ${tableSize}. If a value above 8 is entered then it will default to 8`);
            e.target.value = "";
            setPartySize(Number(8));
        }
        else if(newPartySize < 1)
        {
            alert("Minimum number of seats allowed is 1. If a value below 1 is entered then it will default to 1");
            e.target.value = "";
            setPartySize(Number(1));
        }
        else
        {
            setPartySize(Number(newPartySize));
        }
    };
    async function handleCopyClick() {
        try {
            await window.navigator.clipboard.writeText(confirmationNumber.toString());
            alert("Copied to clipboard!");
        } catch (err) {
            console.error(
                "Unable to copy to clipboard.",
                err
            );
            alert("Copy to clipboard failed.");
        }
    }
    function handleCreate(){
        const newConfirmationNumber = Math.floor((Math.random() * 10000)) + 1;
        setConfirmationNumber(newConfirmationNumber);
        setNotInvisible(false);
        console.log(newConfirmationNumber);
        instance.post('/consumerMakeReservation', {"name":name, "address":address, "tableID":tableID, "partySize": partySize, "confirmation": newConfirmationNumber, "day": date, "time":time, "email": email})
            .then(function (response) {
                // let status = response.data.statusCode
                // let resultComp = response.data.body
            })
            .catch(function (error) {
                // this is a 500-type error, where there is no such API on the server side
                return error
            })
    }


    return (
        <>
            <Header hidden={false}/>
            {isNotInvisible && (
            <div className={`flex justify-center items-center h-full mt-36`}>
                <Card className="w-[800px]">
                    <CardHeader>
                        <CardTitle>Make Reservation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-5">
                                    <Label>Name: {name}</Label>
                                    <Label>Address: {address}</Label>
                                    <Label>Table ID: {tableID}</Label>
                                    <Label htmlFor="day">Date: {date? date.toString() : ""}</Label>
                                    <Label htmlFor="time">Time: {time}</Label>
                                    <Label htmlFor="name">Email <span style={{color: 'red'}}>*</span></Label>
                                    <Input id="name" type="email" placeholder="abc@gmail.com" onChange={handleEmailChange}
                                           required={true}/>
                                    <Label htmlFor="address">Party Size <span style={{color: 'red'}}>*</span></Label>
                                    <Input id="address" type="number" placeholder="Enter number of seats" onChange={handlePartySizeChange}
                                           required={true}/>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Link href="/">
                            <Button variant="outline">Back</Button>
                        </Link>
                        <Button disabled={!isFormValid} onClick={() => handleCreate()}>Submit</Button>
                    </CardFooter>
                </Card>
            </div>)}
            {!isNotInvisible && (
                <div className={`flex justify-center items-center h-full mt-44`}>
                    <Card className="w-[800px]">
                        <CardHeader>
                            <CardTitle>Reservation Confirmation</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-5">
                                        <Label htmlFor="confirmation">Confirmation Number: {confirmationNumber} </Label>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="text-gray-500 flex justify-between">
                            <Label htmlFor="confirmation">Remember to save the confirmation code and show it at the restaurant</Label>
                            <Button onClick={() => handleCopyClick()}><Copy />Copy</Button>
                            <Link href="/">
                                <Button>Back</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </div>)}
        </>
    );

}
