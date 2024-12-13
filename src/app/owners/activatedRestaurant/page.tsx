'use client'
import {Label} from "@/components/ui/label";
import React, {ReactNode, useEffect, useState} from "react";
import DateCalendar from "@/app/(components)/Date";
import Header from "@/app/(components)/Header";
import Save from "@/app/(components)/Save";
import {Button} from "@/components/ui/Button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import axios from "axios";

const instance = axios.create({
    baseURL: 'https://8ng83lxa6k.execute-api.us-east-1.amazonaws.com/G2Iteration1'
});

export default function ActivateRestaurantPage() {
    const [isVisible, setVisible] = React.useState(false);
    const [restaurantID, setRestaurantID] = useState(-1);
    const [openDay, setOpenDay] = useState<Date | undefined>(undefined);
    const [closeDay, setCloseDay] = useState<Date | undefined>(undefined);
    const [numberOfTables, setNumberOfTables] = useState<number>(0);
    const [openingHour, setOpeningHour] = useState<number>(0);
    const [closingHour, setClosingHour] = useState<number>(0);
    const today = new Date();
    const [cells, setCells] = useState<ReactNode[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setRestaurantID(Number(localStorage.getItem("restaurantID")) || -1);
            setNumberOfTables(Number(localStorage.getItem("numberOfTables") || 1));
            setOpeningHour(Number(localStorage.getItem("openHour") || 0));
            setClosingHour(Number(localStorage.getItem("closeHour") || 0));
        }
    }, []);

    const handleGenerateAvailability = (e: React.MouseEvent<HTMLButtonElement>) => {
        instance.post('/ownerReviewDayAvailability', {"restaurantID":restaurantID, "day":today.toISOString().slice(0, 10)})
            .then(function (response) {
                // let status = response.data.statusCode
                const result = response.data.result;
                console.log("Result: " + result);
                for (let i = openingHour; i <= closingHour; i++) {
                    cells.push(
                        <TableRow key={i}>
                            <TableCell key={i}>{i}:00</TableCell>
                            {result === "0"
                                ? Array.from({ length: numberOfTables }, (_, j) => (
                                    <TableCell className={`text-green-700`} key={j + 1} id={String(j + 1)}>Available</TableCell>
                                ))
                                : Array.from({ length: numberOfTables }, (_, j) => {
                                    const tableID = j + 1;
                                    const tableData = result.find(
                                        (item:{ tableID: number, time: number }) => item.tableID === tableID && item.time === i
                                    );

                                    return (
                                        <TableCell key={`${i}-${tableID}`} id={String(tableID)}>
                                            {tableData ? tableData.numberOfSeats : 'Available'}
                                        </TableCell>
                                    );
                                })
                            }
                        </TableRow>
                    );
                }
                setCells([...cells]);
            })
            .catch(function (error) {
                // this is a 500-type error, where there is no such API on the server side
                return error
            })
        setVisible(true);
    }

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
            <TableHead className={`text-black font-black`} key={i}>Table #{i}</TableHead>
        );
    }



    // for(let i = openingHour; i <=closingHour; i++){
    //     cells.push(
    //         <TableRow key={i}>
    //             <TableCell key={i}>{i}:00</TableCell>
    //             {innerCells}
    //         </TableRow>
    //
    //     );
    // }

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
            <div className={`flex justify-center mt-16`}>
                <Button onClick={handleGenerateAvailability}>Review Current Date Availability</Button>
            </div>

            {isVisible && <div className={`flex justify-center m-24`}>
                <Table>
                    <TableHeader>
                        <TableRow id="header">
                            <TableHead className={`text-black font-black`}>Time</TableHead>
                            {tables}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cells}
                    </TableBody>
                </Table>
            </div> }
        </>
    )
};
