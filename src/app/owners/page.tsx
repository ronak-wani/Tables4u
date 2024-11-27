'use client'
import React from 'react'
import {Button} from "@/components/ui/Button";
import Link from "next/link";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import axios from "axios";
import { useRouter } from 'next/navigation';

const instance = axios.create({
    baseURL: 'https://8ng83lxa6k.execute-api.us-east-1.amazonaws.com/G2Iteration1'
});

export default function owner(){
    let [password, setPassword] = React.useState("");
    const router = useRouter();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        password = newPassword;
    };
    const handleLogin = () => {
        instance.post('/loginAdministrator', { adminPass: password }) 
            .then((response) => {
                if (response.data.statusCode === 200) {
                    router.push("/admin");
                } else {
                    instance.post('/loginRestaurant', { password })
                        .then(function (response) {
                            console.log("Success");
                            console.log(response.data);
                            let status = response.data.statusCode;
                            const result = response.data.result.restaurant[0];
                            router.push(
                                `/owners/editRestaurant?restaurantID=${encodeURIComponent(result.restaurantID)}&Name=${encodeURIComponent(result.name)}&Address=${encodeURIComponent(result.address)}&isActive=${encodeURIComponent(result.isActive)}&openHour=${result.openHour}&closeHour=${result.closeHour}`
                            );
                        })
                        .catch(function (error) {
                            console.error("Error logging in:", error);
                            alert("Invalid access key. Please try again.");
                        });
                }
            })
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

                                <Button disabled={password === ""} onClick={() => handleLogin()}>
                                        Login
                                    </Button>
                        </CardFooter>
                    </Card>
            </div>

        </>
    )
}