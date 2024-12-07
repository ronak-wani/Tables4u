'use client'
import {Label} from "@/components/ui/label";
import React, {useState} from "react";
import DateCalendar from "@/app/(components)/Date";
import Header from "@/app/(components)/Header";
import Save from "@/app/(components)/Save";


export default function ActivateRestaurantPage() {
    const [openDay, setOpenDay] = useState<Date | undefined>(undefined);
    const [closeDay, setCloseDay] = useState<Date | undefined>(undefined);
    const today = new Date();

    const handleOpenDay = (date: Date | undefined) => {
        if (date && date <= today) {
            alert("Invalid Open Date. Enter a date in the future.");
            setOpenDay(undefined);
        } else {
            setOpenDay(date);
        }
    };
    const handleCloseDay = (date: Date | undefined) => {
        if (date && date <= today) {
            alert("Invalid Close Date. Enter a date in the future.");
            setCloseDay(undefined);
        } else {
            setCloseDay(date);
        }
    };

    return (
        <>
            <Header hidden={false}/>
            <div className={`flex justify-center items-center h-full mt-44`}>
                <Label htmlFor="closeDay" className={`mr-5`}>Close Future Date</Label>
                <div className={`mr-5`}>
                    <DateCalendar selectedDate={closeDay} onDateChange={handleCloseDay} label="Select Close Date"/>
                </div>
                <Save route="/ownerCloseFutureDay" message="Customers will not be able to book reservations for the closed day"/>
                <Label htmlFor="openDay" className={`mr-5`}>Open Future Date</Label>
                <div className={`mr-5`}>
                    <DateCalendar selectedDate={openDay} onDateChange={handleOpenDay} label="Select Open Date"/>
                </div>
                <Save route="ownerOpenFutureDay" message="Customer will be able to book reservations for the open day"/>
            </div>
        </>
    )
};
