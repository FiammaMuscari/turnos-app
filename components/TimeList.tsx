import React, { useState } from "react";

interface TimeListProps {
  onSelectTime: (time: string) => void;
}

const TimeList: React.FC<TimeListProps> = ({ onSelectTime }) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleTimeSelection = (time: string) => {
    setSelectedTime(time);
    onSelectTime(time);
  };

  // Generar una lista de horas de 9am a 5pm
  const generateTimes = () => {
    const times = [];
    for (let i = 9; i <= 17; i++) {
      const time = `${i}:00`;
      times.push(time);
    }
    return times;
  };

  return (
    <div>
      <h2>Seleccione una hora:</h2>
      <ul className="grid grid-cols-3 gap-4">
        {generateTimes().map((time, index) => (
          <li
            key={index}
            className={`p-4 rounded-sm cursor-pointer ${
              selectedTime === time
                ? "bg-white text-blue-400"
                : "bg-slate-200 text-black"
            }`}
            onClick={() => handleTimeSelection(time)}
          >
            <div className="timeInfo">
              <p>{time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TimeList;
