"use client";

import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface CalendarProps {
    onSelect?: (date: Date | undefined) => void;
    disabled?: (date: Date) => boolean;
    selected?: Date;
}

export function Calendar({ onSelect, disabled, selected }: CalendarProps) {
    const [date, setDate] = useState<Date | undefined>(selected);

    const handleSelect = (newDate: Date | undefined) => {
        setDate(newDate);
        onSelect?.(newDate);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                        format(date, "PPP", { locale: fr })
                    ) : (
                        <span>Sélectionner une date</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={handleSelect}
                    disabled={disabled}
                    initialFocus
                    locale={fr}
                />
            </PopoverContent>
        </Popover>
    );
}
