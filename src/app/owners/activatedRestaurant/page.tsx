'use client'
import {Label} from "@/components/ui/label";
import React, {useEffect, useState} from "react";
import DateCalendar from "@/app/(components)/Date";
import Header from "@/app/(components)/Header";
import Save from "@/app/(components)/Save";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"



export default function ActivateRestaurantPage() {
    const [openDay, setOpenDay] = useState<Date | undefined>(undefined);
    const [closeDay, setCloseDay] = useState<Date | undefined>(undefined);
    const [numberOfTables, setNumberOfTables] = useState<number>(0);
    const [openingHour, setOpeningHour] = useState<number>(0);
    const [closingHour, setClosingHour] = useState<number>(0);
    const today = new Date();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setNumberOfTables(Number(localStorage.getItem("numberOfTables") || 1));
            setOpeningHour(Number(localStorage.getItem("openHour") || 0));
            setClosingHour(Number(localStorage.getItem("closeHour") || 0));
        }
    }, []);

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

    const tables = [];
    for (let i = 1; i <=numberOfTables; i++) {
        tables.push(
            <TableHead id={i.toString()}>Table #{i}</TableHead>
        );
    }

    const cells = [];

    for(let i = openingHour; i <=closingHour; i++){
        cells.push(
            <TableRow>
                <TableCell id={i.toString()}>{i}:00</TableCell>
            </TableRow>

        );
    }

    return (
        <>
            <Header hidden={false}/>
            <div className={`flex justify-center items-center h-full mt-32`}>
                <Label htmlFor="closeDay" className={`mr-5`}>Close Future Date</Label>
                <div className={`mr-5`}>
                    <DateCalendar selectedDate={closeDay} onDateChange={handleCloseDay} label="Select Close Date"/>
                </div>
                <Save route={`/ownerCloseFutureDay`} closeDay={closeDay} message="Customers will not be able to book reservations for the closed day"/>
                <Label htmlFor="openDay" className={`mr-5`}>Open Future Date</Label>
                <div className={`mr-5`}>
                    <DateCalendar selectedDate={openDay} onDateChange={handleOpenDay} label="Select Open Date"/>
                </div>
                <Save route={`/ownerOpenFutureDay`} openDay={openDay} message="Customer will be able to book reservations for the open day"/>
            </div>
            <Label className={`flex justify-center mt-16`}>Review Current Date Availability</Label>
            <div className={`flex justify-center m-24`}>
                <Table>
                    <TableHeader>
                        <TableRow id="header">
                            <TableHead>Time</TableHead>
                            {tables}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cells}
                    </TableBody>
                </Table>
            </div>
        </>
    )
};
