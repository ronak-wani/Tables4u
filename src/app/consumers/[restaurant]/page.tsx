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

const instance = axios.create({
    baseURL: 'https://8ng83lxa6k.execute-api.us-east-1.amazonaws.com/G2Iteration1'
});

export default function MakeReservation() {
    const [email, setEmail] = useState("");
    const [partySize, setPartySize] = useState(0);
    const [tableSize, setTableSize] = useState(0);
    const [tableID, setTableID] = useState(0);
    const [Name, setName] = useState<string | null>(null);
    const [Address, setAddress] = useState<string | null>(null);
    const isFormValid:boolean = email.trim() !== "" && partySize !== 0;
    const [confirmationNumber, setConfirmationNumber] = React.useState(-1);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setName(localStorage.getItem("name"));
            setAddress(localStorage.getItem("address"));
            setTableID(Number(localStorage.getItem("numberOfSeats") || 1));
            setTableSize(Number(localStorage.getItem("numberOfTables") || 1));
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

    function handleCreate(){
        const newConfirmationNumber = (Math.random() * 10000) + 1;
        setConfirmationNumber(newConfirmationNumber);
        console.log(newConfirmationNumber);
        // instance.post('/createRestaurant', {"name":Name, "address":Address, "password":newPassword})
        //     .then(function (response) {
        //         // let status = response.data.statusCode
        //         // let resultComp = response.data.body
        //     })
        //     .catch(function (error) {
        //         // this is a 500-type error, where there is no such API on the server side
        //         return error
        //     })
    }


    return (
        <>
            <Header hidden={false}/>
            <div className={`flex justify-center items-center h-full mt-36`}>
                <Card className="w-[800px]">
                    <CardHeader>
                        <CardTitle>Make Reservation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-5">
                                    <Label>Name: {Name}</Label>
                                    <Label>Address: {Address}</Label>
                                    <Label>Table ID: {tableID}</Label>
                                    <Label htmlFor="day">Date <span style={{color: 'red'}}>*</span></Label>
                                    <Input id="day" type="date" placeholder="" onChange={handleEmailChange}
                                           required={true}/>
                                    <Label htmlFor="time">Time <span style={{color: 'red'}}>*</span></Label>
                                    <Input id="time" type="number" placeholder="" onChange={handleEmailChange}
                                           required={true}/>

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
            </div>
        </>
    );

}
