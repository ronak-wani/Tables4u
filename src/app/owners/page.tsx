'use client'
import React from 'react'
import {Button} from "@/components/ui/Button";
import Link from "next/link";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

export default function owner(){
    const [passcode, setPasscode] = React.useState("");
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasscode(e.target.value);
    };
    return(
        <>
            <div className="flex justify-end items-center m-5">
                <div>
                    <Link href="/owners/NewRestaurant">
                        <Button>Create Restaurant</Button>
                    </Link>
                </div>
            </div>
            <div className={`flex justify-center items-center h-full mt-60`}>
                    <Card className="w-[600px]">
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                            <CardDescription>Enter your access key</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="passcode">Access Key</Label>
                                        <Input id="passcode" placeholder="Access Key" onChange={handleChange} required={true}/>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Link href="/">
                                <Button variant="outline">Back</Button>
                            </Link>

                                <Button disabled={passcode === ""}>
                                    <Link href="/owners/EditRestaurant">
                                        Login
                                    </Link>
                                    </Button>
                        </CardFooter>
                    </Card>
            </div>

        </>
    )
}