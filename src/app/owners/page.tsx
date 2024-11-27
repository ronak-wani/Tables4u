'use client'
import React from 'react'
import {Button} from "@/components/ui/Button";
import Link from "next/link";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

export default function owner(){
    const [password, setPassword] = React.useState("");
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };
    return(
        <>
            <div className="flex justify-end items-center m-5">
                <div>
                    <Link href="/owners/createRestaurant">
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
                                        <Label htmlFor="password">Access Key</Label>
                                        <Input id="password" placeholder="Access Key" onChange={handleChange} required={true}/>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Link href="/">
                                <Button variant="outline">Back</Button>
                            </Link>

                                <Button disabled={password === ""}>
                                    <Link href="/owners/editRestaurant">
                                        Login
                                    </Link>
                                    </Button>
                        </CardFooter>
                    </Card>
            </div>

        </>
    )
}