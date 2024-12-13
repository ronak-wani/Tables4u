'use client'
import React, { useState } from "react";
import Header from "@/app/(components)/Header";
import {Table, TableBody, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import axios from "axios";

const instance = axios.create({
    baseURL: 'https://8ng83lxa6k.execute-api.us-east-1.amazonaws.com/G2Iteration1'
});

export default function Home(){
    return (
        <>
            <Header hidden={false}/>
            <h1 className={`text-black font-black flex justify-center`}>Admin Availability Report</h1>
            <div className={`flex justify-center m-24`}>
                <Table>
                    <TableHeader>
                        <TableRow id="header">
                            <TableHead className={`text-black font-black`}>Time</TableHead>
                            {/*{tables}*/}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/*{cells}*/}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}