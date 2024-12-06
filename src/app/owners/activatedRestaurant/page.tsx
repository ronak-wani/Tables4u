'use client'
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import React, {useState} from "react";
import DateCalendar from "@/app/(components)/Date";
import Header from "@/app/(components)/Header";
import {Dialog, DialogContent, DialogDescription, DialogTitle} from "@/components/ui/dialog";
import axios from "axios";
import {Button} from "@/components/ui/Button";

const instance = axios.create({
        baseURL: 'https://8ng83lxa6k.execute-api.us-east-1.amazonaws.com/G2Iteration1'
});

export default function activateRestaurantPage() {
    const [openDay, setOpenDay] = useState<Date | undefined>(undefined);
    const [closeDay, setCloseDay] = useState<Date | undefined>(undefined);
    const today = new Date();
    const [password, setPassword] = React.useState("");
    const [saveDialogOpen, setSaveDialogOpen] = useState(false);

    const handleOpenDay = (date: Date | undefined) => {
        if (date && date < today) {
            alert("Invalid Open Date. Cannot enter a date in past.");
            setOpenDay(undefined);
        } else {
            setOpenDay(date);
        }
    };
    const handleAccessKey = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };
    const handleCloseDay = (date: Date | undefined) => {
        if (date && date < today) {
            alert("Invalid Close Date. Cannot enter a date in the past.");
            setCloseDay(undefined);
        } else {
            setCloseDay(date);
        }
    };
    const handleSave = (checked: boolean, i?: number) => {
        setSaveDialogOpen(true);
        if (checked) {
            instance.post('/ownerCloseFutureDay', {
                "password": password,
                "closedDay": closeDay? closeDay.toISOString().slice(0, 10) : null,
            })
                .then(function (response) {
                    // let status = response.data.statusCode
                    // let resultComp = response.data.body
                })
                .catch(function (error) {
                    // this is a 500-type error, where there is no such API on the server side
                    return error
                })
        } else {
            setSaveDialogOpen(false);
        }
    }
    return (
        <>
            <Header hidden={false}/>
                <div className={`flex justify-center items-center h-full mt-44`}>
                        <Label htmlFor="closeDay" className={`mr-5`}>Close Future Date</Label>
                        <div className={`mr-5`}>
                                <DateCalendar selectedDate={closeDay} onDateChange={handleCloseDay}
                                              label="Select Close Date"/>
                        </div>
                        <Label htmlFor="openDay" className={`mr-5`}>Open Future Date</Label>
                        <div className={`mr-5`}>
                                <DateCalendar selectedDate={openDay} onDateChange={handleOpenDay}
                                              label="Select Open Date"/>
                        </div>
                        <div className="flex justify-center space-x-2">
                                <Button type="button" onClick={() => setSaveDialogOpen(true)}>Save</Button>
                                <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                                        <DialogContent>
                                                <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                <DialogDescription>
                                                        Customers will not be able to book reservations for the closed days
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
                </div>
        </>
    )
};
