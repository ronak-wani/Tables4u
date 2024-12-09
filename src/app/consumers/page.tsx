import React from 'react'
import {Button} from "@/components/ui/Button";
import Link from "next/link";
import Header from "@/app/(components)/Header";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

export default function consumer(){
    return(
        <>
            <Header hidden={false}></Header>
            <div className={`flex justify-center items-center h-full mt-64`}>
                <Card className="w-[600px]">
                    <CardHeader>
                        <CardTitle>Manage Reservation</CardTitle>
                        <CardDescription>Enter your Email and Confirmation Code</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name">Email</Label>
                                    <Input id="name" placeholder="Email" />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardContent>
                        <form>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name">Confirmation Code</Label>
                                    <Input id="name" placeholder="Confirmation Code" />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Link href="/">
                            <Button variant="outline">Back</Button>
                        </Link>
                        <Button>Login</Button>
                    </CardFooter>
                </Card>
            </div>

        </>
    )
}