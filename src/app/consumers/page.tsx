import React from 'react'
import {Button} from "@/components/ui/Button";
import {Reservation} from "@/app/(components)/Reservation";
import Link from "next/link";

export default function consumer(){
    return(
        <>
            <div className="flex justify-between items-center m-5">
                <div>
                    <Link href="/">
                        <Button>Back</Button>
                    </Link>
                </div>
            </div>
            <div className={`flex justify-center items-center h-full mt-64`}>
                <Reservation/>
            </div>

        </>
    )
}