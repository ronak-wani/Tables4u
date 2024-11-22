import React from 'react'
import {Button} from "@/components/ui/Button";
import {Restaurant} from "@/app/(components)/Restaurant";
import Link from "next/link";

export default function createRestaurant(){
    return(
        <>
            <div className="flex justify-between items-center m-5">
                <div>
                    <Link href="/owners">
                        <Button>Back</Button>
                    </Link>
                </div>
                <div>
                    <Button>test</Button>
                </div>
            </div>
            <div className={`flex justify-center items-center h-full mt-60`}>
                <Restaurant/>
            </div>

        </>
    )
}