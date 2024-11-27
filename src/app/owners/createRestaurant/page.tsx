'use client'
import React from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/Button";
import Link from "next/link";
import { Copy } from 'lucide-react';
import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://8ng83lxa6k.execute-api.us-east-1.amazonaws.com/owners'
});

export default function createRestaurantPage() {
    const [Name, setName] = React.useState("");
    const [Address, setAddress] = React.useState("");
    const [numberOfTables, setNumberOfTables] = React.useState(0);
    const [isNotInvisible, setNotInvisible] = React.useState(true);
    const [password, setPassword] = React.useState("");

    const isFormValid:boolean = Name.trim() !== "" && Address.trim() !== "" && numberOfTables !== 0;


    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };
    
    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(e.target.value);
    };

    const handleNumberOfTablesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNumberOfTables(Number(e.target.value));
    };

    function handleCreate(){
        const newPassword = (Math.random() * 999999).toString(36).slice(0);
        setPassword(newPassword);
        console.log(newPassword);
        setNotInvisible(false);
        instance.post('/createRestaurant', {"name":Name, "address":Address, "numberOfTables": numberOfTables, "password":newPassword})
            .then(function (response) {
                let status = response.data.statusCode
                let resultComp = response.data.body
            })
            .catch(function (error) {
                // this is a 500-type error, where there is no such API on the server side
                return error
            })
    }

    async function handleCopyClick() {
        try {
            await window.navigator.clipboard.writeText(password);
            alert("Copied to clipboard!");
        } catch (err) {
            console.error(
                "Unable to copy to clipboard.",
                err
            );
            alert("Copy to clipboard failed.");
        }
    }
    return (
        <>
            {isNotInvisible && (
            <div className={`flex justify-center items-center h-full mt-44`}>
                <Card className="w-[800px]">
                    <CardHeader>
                        <CardTitle>Restaurant</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-5">
                                    <Label htmlFor="name">Name <span style={{color: 'red'}}>*</span></Label>
                                    <Input id="name" placeholder="Restaurant Name" onChange={handleNameChange} required={true}/>
                                    <Label htmlFor="address">Address <span style={{color: 'red'}}>*</span></Label>
                                    <Input id="address" placeholder="Restaurant Address" onChange={handleAddressChange} required={true}/>
                                    <Label htmlFor="numberOfTables">Number of Tables <span style={{color: 'red'}}>*</span></Label>
                                    <Input type="number" id="numberOfTables" placeholder="Number of Tables" onChange={handleNumberOfTablesChange} required={true}/>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Link href="/owners">
                            <Button variant="outline">Back</Button>
                        </Link>
                        <Button disabled={!isFormValid} onClick={() => handleCreate()}>Create</Button>
                    </CardFooter>
                </Card>
            </div>)}
            {!isNotInvisible && (
                <div className={`flex justify-center items-center h-full mt-44`}>
                    <Card className="w-[800px]">
                        <CardHeader>
                            <CardTitle>Access Code</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-5">
                                        <Label htmlFor="password">ACCESS KEY: {password} </Label>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="text-gray-500 flex justify-between">
                            <Label htmlFor="password">Remember to save the access key to edit and activate the restaurant </Label>
                            <Button onClick={() => handleCopyClick()}><Copy />Copy</Button>
                            <Link href="/owners">
                                <Button>Login</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </div>)}
        </>
    )
}