import React from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/Button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Link from "next/link";
export default function createRestaurantPage() {
    return (
        <>
            <div className="flex justify-between items-center m-5">
                <Link href="/owners">
                    <Button>Back</Button>
                </Link>
            </div>
            <div className={`flex justify-center items-center h-full mt-44`}>
                <Card className="w-[800px]">
                    <CardHeader>
                        <CardTitle>Restaurant</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-5">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" placeholder="Restaurant Name"/>
                                    <Label htmlFor="address">Address</Label>
                                    <Input id="address" placeholder="Restaurant Address"/>
                                    <Label htmlFor="numberOfTables">Number of Tables</Label>
                                    <Input type="number" id="numberOfTables" placeholder="Number of Tables"/>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline">Cancel</Button>
                        <Link href="/owners/NewRestaurant/EditRestaurant">
                            <Button>Create</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}