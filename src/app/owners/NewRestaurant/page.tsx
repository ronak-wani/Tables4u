'use client'
import React from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/Button";
import Link from "next/link";

export default function createRestaurantPage() {
    const [Name, setName] = React.useState("");
    const [Address, setAddress] = React.useState("");
    const [numberOfTables, setNumberOfTables] = React.useState(0);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(e.target.value);
    };

    const handleNumberOfTablesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNumberOfTables(Number(e.target.value));
    };
    return (
        <>
            <div className="flex justify-between items-center m-5">
                <Link href="/owners">
                    <Button>Back</Button>
                </Link>
            </div>
            <div className={`flex justify-center items-center h-full mt-44`}>
                <Card className="w-[800px]">
                    <CardHeader>
                        <CardTitle>Restaurant</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-5">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" placeholder="Restaurant Name" onChange={handleNameChange}/>
                                    <Label htmlFor="address">Address</Label>
                                    <Input id="address" placeholder="Restaurant Address" onChange={handleAddressChange}/>
                                    <Label htmlFor="numberOfTables">Number of Tables</Label>
                                    <Input type="number" id="numberOfTables" placeholder="Number of Tables" onChange={handleNumberOfTablesChange}/>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline">Cancel</Button>
                        <Link href="/owners/NewRestaurant/EditRestaurant">
                            <Button>Create</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}