'use client';
import React, {useState} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
   // DialogHeader,
    DialogTitle,
   // DialogTrigger,
} from "@/components/ui/dialog"
import {Label} from "@/components/ui/label";
import { Input } from "@/components/ui/input"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch"
import axios from "axios";
import { useSearchParams } from 'next/navigation';
import {Button} from "@/components/ui/Button";
import {Trash} from "lucide-react";
import { useRouter } from 'next/navigation';

const instance = axios.create({
    baseURL: 'https://8ng83lxa6k.execute-api.us-east-1.amazonaws.com/G2Iteration1'
});

export default function EditRestaurantPage() {
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const restaurantID = searchParams.get('restaurantID');
    const Name = searchParams.get('Name');
    const Address = searchParams.get('Address');
    const numberOfTables = Number(searchParams.get('numberOfTables') || 0);
    const [openHour, setOpenHour] = React.useState(-1);
    const [closeHour, setCloseHour] = React.useState(-1);
    const [numberOfSeats, setNumberOfSeats] = React.useState(0);
    const [disabledTables, setDisabledTables] = useState<{ [key: number]: boolean }>({});
    
    const handleOpenHour = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOpenHour(Number(e.target.value));
    };
    const handleCloseHour = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCloseHour(Number(e.target.value));
    };
    const handleNumberOfSeatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newNumberOfSeats = Number(e.target.value);
        if (newNumberOfSeats > 8) {
            alert("Maximum number of seats allowed is 8. If a value above 8 is entered then it will default to 8");
            setNumberOfSeats(Number(8));
        } else {
            setNumberOfSeats(Number(newNumberOfSeats));
        }
    };

    function createTable(i:number){
        instance.post('/createTable', {"restaurantID":restaurantID, "tableID":i,"numberOfSeats": numberOfSeats})
            .then(function (response) {
                let status = response.data.statusCode;
                let resultComp = response.data.result;
            })
            .catch(function (error) {
                // this is a 500-type error, where there is no such API on the server side
                return error
            })
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
                    onChange={handleNumberOfSeatsChange}
                />
                <Button type="button" disabled={disabledTables[i]} onClick={(e) =>
                {
                    createTable(i);
                }}> Confirm </Button>
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
        if(checked){
            setDialogOpen(true);
            instance.post('/activateRestaurant', {"name":Name, "address":Address})
                .then(function (response) {
                    let status = response.data.statusCode;
                    let resultComp = response.data.result;
                })
                .catch(function (error) {
                    // this is a 500-type error, where there is no such API on the server side
                    return error
                })
        }
        else{
            setDialogOpen(false);
        }
    };

    const handleDelete = (checked: boolean) => {
        setDeleteDialogOpen(true);
        if(checked){
            instance.post('/deleteRestaurant', {"name":Name, "address":Address})
            .then(function (response) {
                let status = response.data.statusCode
                let resultComp = response.data.body
            })
            .catch(function (error) {
                // this is a 500-type error, where there is no such API on the server side
                return error
            })
            router.push(`/`);
        }
        else{
            setDialogOpen(false);
        }
    }
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
                                    <Label htmlFor="openHour">Open Hour <span style={{color: 'red'}}>*</span></Label>
                                    <Input type="number" className={`w-1/2`} id="openHour" placeholder="Open Hour" onChange={handleOpenHour} required={true}/>
                                    <Label htmlFor="closeHour">Close Hour <span style={{color: 'red'}}>*</span></Label>
                                    <Input type="number" className={`w-1/2`} id="closeHour" placeholder="Close Hour" onChange={handleCloseHour} required={true}/>
                                    {tables}
                                </div>
                                <div className={`flex flex-row`}>
                                <div className="flex items-center space-x-2">
                                    <Label htmlFor="activate">Activate</Label>
                                    <Switch id="activate" checked={isActive} onCheckedChange={handleChange}/>
                                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                        <DialogContent>
                                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                                            <DialogDescription>
                                                Once the restaurant is activated then it cannot be undone and nothing
                                                can be changed
                                            </DialogDescription>
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    className="px-4 py-2 bg-gray-200 rounded"
                                                    onClick={() => {
                                                        handleChange(false); // Reset the switch if the user cancels
                                                        setDeleteDialogOpen(false);
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    className="px-4 py-2 bg-blue-600 text-white rounded"
                                                    onClick={() => {
                                                        handleChange(true); // Confirm the activation
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
                                    <Button type="button" className={`bg-red-600 hover:bg-red-400`} onClick={() => setDeleteDialogOpen(true)}> <Trash />Delete</Button>
                                    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                                        <DialogContent>
                                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                                            <DialogDescription>
                                                Once the restaurant is deleted then it cannot be undone
                                            </DialogDescription>
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    className="px-4 py-2 bg-gray-200 rounded"
                                                    onClick={() => {
                                                        handleDelete(false); // Reset the switch if the user cancels
                                                        setDeleteDialogOpen(false);
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    className="px-4 py-2 bg-blue-600 text-white rounded"
                                                    onClick={() => {
                                                        handleDelete(true); // Confirm the activation
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
    )
};