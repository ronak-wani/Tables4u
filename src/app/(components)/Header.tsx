'use client'
import React from 'react';
import {Button} from "@/components/ui/Button";
import Link from "next/link";
function Header({hidden}: {hidden: boolean}) {
    return (
        <>
            <div className={`flex flex-row justify-between items-center`}>
                {/* Left Side */}
                <Link href="/">
                    <div className={`flex items-center`}>
                        <h1 className={`font-black text-xl text-blue-600 p-5`}>Tables4u</h1>
                    </div>
                </Link>
                {/* Right Side */}
                {hidden && <div className={`flex items-center gap-4`}>
                <Link href="/consumers">
                        <Button variant={"default"} className={`font-black m-2`}> CONSUMERS </Button>
                    </Link>
                    <Link href="/owners">
                        <Button variant={"default"} className={`font-black m-8`}> OWNERS </Button>
                    </Link>
                </div>}
            </div>
        </>
    )
}

export default Header;