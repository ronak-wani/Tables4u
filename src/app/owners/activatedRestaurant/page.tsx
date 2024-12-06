'use client'
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import React from "react";
import Date from "@/app/(components)/Date";
import Header from "@/app/(components)/Header";

export default function EditRestaurantPage() {
    let today:Date = new Date();
    const handleOpenDay = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newOpenDay = e.target.value;
        if (newOpenDay < today) {
            alert("Invalid Open Date. Cannot enter a date in past.");
            e.target.value = "";
            setOpenHour(Number(0));
        } else {
            setOpenHour(Number(newOpenHour));
        }
    };
    const handleCloseDay = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newCloseHour = e.target.value;
        if (newCloseDay < today) {
            alert("Invalid Close Date. Cannot enter a date in past.");
            e.target.value = "";
            setCloseHour(Number(23));
        } else {
            setCloseHour(Number(newCloseHour));
        }
    };
    return (
        <>
                <Header hidden={false}/>
            <div className={`flex justify-center items-center h-full mt-44`}>
                <Label htmlFor="closeDay" className={`mr-5`}>Close Future Date</Label>
                <Date onChange={handleCloseDay}/>
                {/*<Input*/}
                {/*    type="number"*/}
                {/*    className={`w-1/2`}*/}
                {/*    id="closeDay"*/}
                {/*    placeholder={closingHour?.toString()}*/}
                {/*    onChange={handleCloseDay}*/}
                {/*    required={true}*/}
                {/*/>*/}
                <Label htmlFor="openDay" className={`mr-5`}>Open Future Date</Label>
                <Date onChange={handleOpenDay}/>
                {/*<Input*/}
                {/*    type="number"*/}
                {/*    className={`w-1/2`}*/}
                {/*    id="openDay"*/}
                {/*    placeholder={closingHour?.toString()}*/}
                {/*    onChange={handleOpenDay}*/}
                {/*    required={true}*/}
                {/*/>*/}
            </div>
        </>
    )
};
