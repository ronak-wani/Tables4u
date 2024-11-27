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
    const [isActive, setActive] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const handleChange = (checked: boolean) => {
        if (!isActive && dialogOpen) {
            setActive(checked);
        }
        if(checked){
            setDialogOpen(true);
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
                                    <Label>Name: {Name}</Label>
                                    <Label>Address: {Address}</Label>
                                    <Label>Number of Tables: {numberOfTables}</Label>
                                    {tables}
                                </div>
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
                                                        setDialogOpen(false);
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    className="px-4 py-2 bg-blue-600 text-white rounded"
                                                    onClick={() => {
                                                        handleChange(true); // Confirm the activation
                                                        setDialogOpen(false);
                                                    }}
                                                >
                                                    Confirm
                                                </button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    )
};