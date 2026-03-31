import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "../../lib/utils"
import { buttonVariants } from "./button"

// Simple calendar component without react-day-picker dependency
function Calendar({
  className,
  selected,
  onSelect,
  ...props
}) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const selectDate = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    onSelect?.(newDate);
  };
  
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => null);
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  return (
    <div className={cn("p-3", className)} {...props}>
      <div className="space-y-4">
        <div className="flex justify-center pt-1 relative items-center">
          <button
            onClick={previousMonth}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="text-sm font-medium">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
          <button
            onClick={nextMonth}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1"
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <table className="w-full border-collapse space-y-1">
          <thead>
            <tr className="flex">
              {dayNames.map((day) => (
                <th key={day} className="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.ceil((daysInMonth + firstDay) / 7) }, (_, weekIndex) => (
              <tr key={weekIndex} className="flex w-full mt-2">
                {Array.from({ length: 7 }, (_, dayIndex) => {
                  const dayNumber = weekIndex * 7 + dayIndex - firstDay + 1;
                  const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;
                  const isSelected = selected && isValidDay && 
                    selected.getDate() === dayNumber &&
                    selected.getMonth() === currentDate.getMonth() &&
                    selected.getFullYear() === currentDate.getFullYear();
                  const isToday = isValidDay &&
                    new Date().getDate() === dayNumber &&
                    new Date().getMonth() === currentDate.getMonth() &&
                    new Date().getFullYear() === currentDate.getFullYear();
                  
                  return (
                    <td key={dayIndex} className="h-9 w-9 text-center text-sm p-0 relative">
                      {isValidDay && (
                        <button
                          onClick={() => selectDate(dayNumber)}
                          className={cn(
                            buttonVariants({ variant: "ghost" }),
                            "h-9 w-9 p-0 font-normal",
                            isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                            isToday && !isSelected && "bg-accent text-accent-foreground"
                          )}
                        >
                          {dayNumber}
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
Calendar.displayName = "Calendar"

export { Calendar }
