import React from 'react'
import {Button} from "@/components/ui/Button";
import {Login} from "@/app/(components)/Login";
import Link from "next/link";

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
                    <Button>Create Restaurant</Button>
                </div>
            </div>
            <div className={`flex justify-center items-center h-full mt-64`}>
                <Login/>
            </div>

        </>
    )
}