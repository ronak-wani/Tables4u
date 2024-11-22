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
                                    <Select>
                                        <SelectTrigger id="numberOfTables">
                                            <SelectValue placeholder="Select"/>
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            <SelectItem value="1">1</SelectItem>
                                            <SelectItem value="2">2</SelectItem>
                                            <SelectItem value="3">3</SelectItem>
                                            <SelectItem value="4">4</SelectItem>
                                            <SelectItem value="5">5</SelectItem>
                                            <SelectItem value="6">6</SelectItem>
                                            <SelectItem value="7">7</SelectItem>
                                            <SelectItem value="8">8</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline">Cancel</Button>
                        <Button>Create</Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}