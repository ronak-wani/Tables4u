"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DateCalendarProps {
    selectedDate: Date  | undefined;
    onDateChange: (date: Date | undefined) => void;
    label?: string;
    className?: string;
}

const DateCalendar: React.FC<DateCalendarProps> = ({ selectedDate, onDateChange, label, className }) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[225px] h-[40px] justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>{label || "Pick a date"}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => onDateChange(date)}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}

export default DateCalendar