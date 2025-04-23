import React, { useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

interface RangeDateProps {
    value: string | undefined;
    onChange: (value: string) => void;
}

const RangeDate = ({ value, onChange }: RangeDateProps) => {

    useEffect(() => {
        if (value && value.indexOf(',') > 0) {
            let values = value.split(',');
            setDate({
                from: values[0] ? new Date(values[0]) : undefined,
                to: values[1] ? new Date(values[1]) : undefined,
            })
        } else {
            setDate({
                from: undefined,
                to: undefined,
            })
        }
    }, [value])

    const [date, setDate] = React.useState<DateRange | undefined>(undefined)
    return (
        <div className="flex items-center space-x-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="default"
                        className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "yyyy-MM-dd")} - {" "}
                                    {format(date.to, "yyyy-MM-dd")}
                                </>
                            ) : (
                                format(date.from, "yyyy-MM-dd")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={(value => {
                            setDate(value)
                            if (value?.from && value.to) {
                                onChange(`${format(value.from, "yyyy-MM-dd")},${format(value.to, "yyyy-MM-dd")}`);
                            } else {
                                onChange("")
                            }
                        })}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default RangeDate;
