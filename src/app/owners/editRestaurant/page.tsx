'use client';
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { Button } from "@/components/ui/Button";
import { Trash } from "lucide-react";
import { useRouter } from 'next/navigation';

const instance = axios.create({
    baseURL: 'https://8ng83lxa6k.execute-api.us-east-1.amazonaws.com/G2Iteration1'
});

export default function EditRestaurantPage() {
    const router = useRouter();

    // Initialize state variables
    const [restaurantID, setRestaurantID] = useState<string | null>(null);
    const [Name, setName] = useState<string>('');
    const [Address, setAddress] = useState<string>('');
    const [numberOfTables, setNumberOfTables] = useState<number>(0);

    const [password, setPassword] = useState("");
    const [openHour, setOpenHour] = useState(-1);
    const [closeHour, setCloseHour] = useState(-1);
    const [numberOfSeats, setNumberOfSeats] = useState(0);
    const [disabledTables, setDisabledTables] = useState<{ [key: number]: boolean }>({});

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Only run this code in the browser (client-side)
            const storedRestaurantID = localStorage.getItem('restaurantID');
            const storedName = localStorage.getItem('Name');
            const storedAddress = localStorage.getItem('Address');
            const storedNumberOfTables = localStorage.getItem('numberOfTables');

            if (storedRestaurantID) setRestaurantID(storedRestaurantID);
            if (storedName) setName(storedName);
            if (storedAddress) setAddress(storedAddress);
            if (storedNumberOfTables) setNumberOfTables(Number(storedNumberOfTables));
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Save data to localStorage whenever the state changes
            localStorage.setItem('restaurantID', restaurantID || '');
            localStorage.setItem('Name', Name);
            localStorage.setItem('Address', Address);
            localStorage.setItem('numberOfTables', String(numberOfTables));
        }
    }, [restaurantID, Name, Address, numberOfTables]);

    function createTable(i: number) {
        instance.post('/createTable', { "restaurantID": restaurantID, "tableID": i, "numberOfSeats": numberOfSeats })
            .then(function (response) {
                let status = response.data.statusCode;
                let resultComp = response.data.result;
            })
            .catch(function (error) {
                return error;
            });

        setDisabledTables((prev) => ({
            ...prev,
            [i]: true, // Disable this specific table
        }));
    }

    const tables = [];
    for (let i = 1; i <= numberOfTables; i++) {
        tables.push(
            <div key={i} className="flex items-center space-x-2">
                <Label htmlFor={`Table${i}Seats`} className="mr-5">Table {i}:</Label>
                <Input
                    type="number"
                    id={`Table${i}Seats`}
                    className="w-1/2"
                    placeholder={`Enter number of seats for Table ${i}`}
                    min={1}
                    max={8}
                    disabled={disabledTables[i]}
                    onChange={(e) => setNumberOfSeats(Number(e.target.value))}
                />
                <Button type="button" disabled={disabledTables[i]} onClick={(e) => createTable(i)}> Confirm </Button>
            </div>
        );
    }

    const [isActive, setActive] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleChange = (checked: boolean) => {
        if (!isActive && dialogOpen) {
            setActive(checked);
        }
        if (checked) {
            setDialogOpen(true);
            instance.post('/activateRestaurant', { "name": Name, "address": Address, "password": password, "openHour": openHour, "closeHour": closeHour })
                .then(function (response) {
                    let status = response.data.statusCode;
                    let resultComp = response.data.result;
                })
                .catch(function (error) {
                    return error;
                });
        } else {
            setDialogOpen(false);
        }
    };

    const handleDelete = (checked: boolean) => {
        setDeleteDialogOpen(true);
        if (checked) {
            instance.post('/deleteRestaurant', { "name": Name, "address": Address, "password": password })
                .then(function (response) {
                    let status = response.data.statusCode;
                    let resultComp = response.data.body;
                })
                .catch(function (error) {
                    return error;
                });
            router.push(`/`);
        } else {
            setDialogOpen(false);
        }
    };

    return (
        <>
            <div className={`flex justify-center items-center h-full mt-44`}>
                <Card className="w-[800px]">
                    <CardHeader>
                        <CardTitle>Restaurant</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-5">
                                    <Label>RestaurantID: {restaurantID}</Label>
                                    <Label>Name: {Name}</Label>
                                    <Label>Address: {Address}</Label>
                                    <Label>Number of Tables: {numberOfTables}</Label>
                                    <Label htmlFor="openHour">Open Hour <span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="number" className={`w-1/2`} id="openHour" placeholder="Open Hour" onChange={(e) => setOpenHour(Number(e.target.value))} required={true} />
                                    <Label htmlFor="closeHour">Close Hour <span style={{ color: 'red' }}>*</span></Label>
                                    <Input type="number" className={`w-1/2`} id="closeHour" placeholder="Close Hour" onChange={(e) => setCloseHour(Number(e.target.value))} required={true} />
                                    {tables}
                                </div>
                                <div className={`flex flex-row`}>
                                    <div className="flex items-center space-x-2">
                                        <Label htmlFor="activate">Activate</Label>
                                        <Switch id="activate" checked={isActive} onCheckedChange={handleChange} />
                                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                            <DialogContent>
                                                <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                <div className="flex justify-end space-x-2">
                                                    <Input type="password" className={`w-1/2`} id="password" placeholder="Access key" onChange={(e) => setPassword(e.target.value)} required={true} />
                                                    <button
                                                        className="px-4 py-2 bg-gray-200 rounded"
                                                        onClick={() => {
                                                            handleChange(false);
                                                            setDeleteDialogOpen(false);
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        className="px-4 py-2 bg-blue-600 text-white rounded"
                                                        onClick={() => {
                                                            handleChange(true);
                                                            setDeleteDialogOpen(false);
                                                        }}
                                                    >
                                                        Confirm
                                                    </button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <div className="flex ml-auto space-x-2">
                                        <Button type="button" className={`bg-red-600 hover:bg-red-400`} onClick={() => setDeleteDialogOpen(true)}><Trash />Delete</Button>
                                        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                                            <DialogContent>
                                                <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                <div className="flex justify-end space-x-2">
                                                    <Input type="password" className={`w-1/2`} id="password" placeholder="Access key" onChange={(e) => setPassword(e.target.value)} required={true} />
                                                    <button
                                                        className="px-4 py-2 bg-gray-200 rounded"
                                                        onClick={() => {
                                                            handleDelete(false);
                                                            setDeleteDialogOpen(false);
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        className="px-4 py-2 bg-blue-600 text-white rounded"
                                                        onClick={() => {
                                                            handleDelete(true);
                                                            setDeleteDialogOpen(false);
                                                        }}
                                                    >
                                                        Confirm
                                                    </button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
