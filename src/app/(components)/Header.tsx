'use client'
import React from 'React';
import {Button} from "@/components/ui/Button";
function Header() {
    return (
        <>
            <div className={`flex flex-row justify-between items-center`}>
                {/* Left Side */}
                <div className={`flex items-center`}>
                    <h1 className={`font-black text-xl text-blue-600 p-5`}>Tables4u</h1>
                </div>
                {/* Right Side */}
                <div className={`flex items-center gap-4`}>
                    <Button variant={"default"} className={`font-black m-2`}> CONSUMERS </Button>
                    <Button variant={"default"} className={`font-black m-8`}> OWNERS </Button>
                </div>
            </div>
        </>
    )
}

export default Header;