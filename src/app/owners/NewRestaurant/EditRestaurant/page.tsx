import React from 'react';
import {Label} from "@/components/ui/label";
import { Input } from "@/components/ui/input"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
interface EditRestaurantPageProps {
    params: { Name: string; Address: string; numberOfTables: number };
}
export default function EditRestaurantPage({ params }: EditRestaurantPageProps) {
    const { Name, Address, numberOfTables } = params;
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
                />
            </div>
        );
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
                                    <Label>Name: {Name}</Label>
                                    <Label>Address: {Address}</Label>
                                    <Label>Number of Tables: {numberOfTables}</Label>
                                    {tables}
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    )
};