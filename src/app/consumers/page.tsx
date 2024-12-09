'use client'
import React from 'react'
import {Button} from "@/components/ui/Button";
import Link from "next/link";
import Header from "@/app/(components)/Header";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

export default function Consumer(){
    const [confirmation, setConfirmation] = React.useState("");
    const [email, setEmail] = React.useState("");

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleConfirmationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmation(e.target.value);
    };

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
                                    <Label htmlFor="name">Email <span style={{color: 'red'}}>*</span></Label>
                                    <Input id="name" type="email" placeholder="abc@gmail.com" onChange={handleEmailChange} required={true}/>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardContent>
                        <form>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name">Confirmation Code <span style={{color: 'red'}}>*</span></Label>
                                    <Input id="name" type="number" placeholder="1234" onChange={handleConfirmationChange} required={true}/>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Link href="/">
                            <Button variant="outline">Back</Button>
                        </Link>
                        <Button disabled={confirmation === "" || email === ""}> {/*onClick={() => handleLogin()}*/}
                            Login
                        </Button>
                    </CardFooter>
                </Card>
            </div>

        </>
    )
}