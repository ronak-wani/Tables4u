import React from 'react'
import {Button} from "@/components/ui/Button";
import Link from "next/link";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

export default function owner(){
    return(
        <>
            <div className="flex justify-between items-center m-5">
                <div>
                    <Link href="/">
                        <Button>Back</Button>
                    </Link>
                </div>
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
                                        <Label htmlFor="name">Access Key</Label>
                                        <Input id="name" placeholder="Access Key" />
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Link href="/owners/EditRestaurant">
                                <Button>Login</Button>
                            </Link>
                        </CardFooter>
                    </Card>
            </div>

        </>
    )
}