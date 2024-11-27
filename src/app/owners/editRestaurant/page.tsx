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
    const openingHour = Number(searchParams.get('openHour') || 0);
    const closingHour = Number(searchParams.get('closeHour') || 0);
    const [isActivated, setIsActivated] = React.useState(searchParams.get('isActive'));
    const [password, setPassword] = React.useState("");
    const [openHour, setOpenHour] = React.useState(openingHour ? Number(openingHour) : 0);
    const [closeHour, setCloseHour] = React.useState(closingHour ? Number(closingHour) : 0);
    const [numberOfSeats, setNumberOfSeats] = React.useState(0);
    const [disabledTables, setDisabledTables] = useState<{ [key: number]: boolean }>({});
    const [numberOfTables, setNumberOfTables] = React.useState(Number(searchParams.get('numberOfTables')) || 0);

    const handleOpenHour = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOpenHour(Number(e.target.value));
    };
    const handleCloseHour = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCloseHour(Number(e.target.value));
    };
    const handleAccessKey = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
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
                    disabled={disabledTables[i] || isActivated === 'Y'}
                    onChange={handleNumberOfSeatsChange}
                />
                <Button type="button" disabled={disabledTables[i]  || isActivated === 'Y'} onClick={(e) =>
                {
                    createTable(i);
                }}> Confirm </Button>
            </div>
        );
    }
    const [on, setOn] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [saveDialogOpen, setSaveDialogOpen] = useState(false);
    const handleChange = (checked: boolean) => {
        if (!on && dialogOpen) {
            setOn(checked);
        }
        if(checked){
            setDialogOpen(true);
            setIsActivated('Y');
            instance.post('/activateRestaurant', {"name":Name, "address":Address, "password":password, "openHour":openHour, "closeHour":closeHour})
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
            instance.post('/deleteRestaurant', {"name":Name, "address":Address, "password":password})
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
            setDeleteDialogOpen(false);
        }
    }
    const handleNumberOfTablesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNumberOfTables(Number(e.target.value));
    };
    const handleSave = (checked: boolean, i?: number) => {
        setSaveDialogOpen(true);
        if(checked){
            instance.post('/editRestaurant', {"password":password, "openHour":openHour, "closeHour":closeHour})
                .then(function (response) {
                    let status = response.data.statusCode
                    let resultComp = response.data.body
                })
                .catch(function (error) {
                    // this is a 500-type error, where there is no such API on the server side
                    return error
                })
            instance.post('/editRestaurant', {"restaurantID":restaurantID, "tableID":i, "numberOfSeats":numberOfSeats})
                .then(function (response) {
                    let status = response.data.statusCode
                    let resultComp = response.data.body
                })
                .catch(function (error) {
                    // this is a 500-type error, where there is no such API on the server side
                    return error
                })
        }
        else{
            setSaveDialogOpen(false);
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
                                    <Label htmlFor="numberOfTables">Number of Tables <span style={{color: 'red'}}>*</span></Label>
                                    <Input disabled={isActivated === 'Y'} type="number" className={`w-1/2`} id="numberOfTables" placeholder={numberOfTables.toString()} onChange={handleNumberOfTablesChange} required={true}/>
                                    <Label htmlFor="openHour">Open Hour <span style={{color: 'red'}}>*</span></Label>
                                    <Input
                                        type="number"
                                        className={`w-1/2`}
                                        id="openHour"
                                        placeholder={openingHour?.toString()}
                                        onChange={handleOpenHour}
                                        required={true}
                                        disabled={isActivated === 'Y'}
                                    />
                                    <Label htmlFor="closeHour">Close Hour <span style={{color: 'red'}}>*</span></Label>
                                    <Input
                                        type="number"
                                        className={`w-1/2`}
                                        id="closeHour"
                                        placeholder={closingHour?.toString()}
                                        onChange={handleCloseHour}
                                        required={true}
                                        disabled={isActivated === 'Y'}
                                    />
                                    {tables}
                                </div>
                                <div className={`flex flex-row mt-8`}>
                                    <div className="flex items-center space-x-2">
                                        <Label htmlFor="activate">Activate</Label>
                                        <Switch id="activate" checked={isActivated === 'Y' || on} onCheckedChange={isActivated === 'Y' ? undefined : handleChange}/>
                                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                            <DialogContent>
                                                <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                <DialogDescription>
                                                    Once the restaurant is activated then it cannot be undone and
                                                    nothing
                                                    can be changed
                                                </DialogDescription>
                                                <div className="flex justify-end space-x-2">
                                                    <Input type="password" className={`w-1/2`} id="password"
                                                           placeholder="Access key" onChange={handleAccessKey}
                                                           required={true}/>
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
                                        <Button disabled={isActivated === 'Y'} type="button" onClick={() => setSaveDialogOpen(true)}>Save</Button>
                                        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                                            <DialogContent>
                                                <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                <DialogDescription>
                                                    Confirm to save the changes
                                                </DialogDescription>
                                                <div className="flex justify-end space-x-2">
                                                    <Input type="password" className={`w-1/2`} id="password"
                                                           placeholder="Access key" onChange={handleAccessKey}
                                                           required={true}/>
                                                    <button
                                                        className="px-4 py-2 bg-gray-200 rounded"
                                                        onClick={() => {
                                                            handleSave(false); // Reset the switch if the user cancels
                                                            setSaveDialogOpen(false);
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        className="px-4 py-2 bg-blue-600 text-white rounded"
                                                        onClick={() => {
                                                            handleSave(true); // Confirm the activation
                                                            setSaveDialogOpen(false);
                                                        }}
                                                    >
                                                        Confirm
                                                    </button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                        <div className="flex ml-auto space-x-2">
                                            <Button type="button" className={`bg-red-600 hover:bg-red-400`}
                                                    onClick={() => setDeleteDialogOpen(true)}> <Trash/>Delete</Button>
                                            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                                                <DialogContent>
                                                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                    <DialogDescription>
                                                        Once the restaurant is deleted then it cannot be undone
                                                    </DialogDescription>
                                                    <div className="flex justify-end space-x-2">
                                                        <Input type="password" className={`w-1/2`} id="password"
                                                               placeholder="Access key" onChange={handleAccessKey}
                                                               required={true}/>
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