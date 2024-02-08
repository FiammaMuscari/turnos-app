import React, { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerFormProps {
  onSelectDate: (date: string | undefined) => void;
}

export function DatePickerForm({ onSelectDate }: DatePickerFormProps) {
  const [date, setDate] = useState<Date | undefined>();

  const handleDateSelection = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    onSelectDate(
      selectedDate
        ? format(selectedDate, "d 'de' MMMM 'del' yyyy", { locale: es })
        : undefined
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] flex m-auto justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          {date ? (
            format(date, "PP", { locale: es })
          ) : (
            <span>Elige un día</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelection}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
