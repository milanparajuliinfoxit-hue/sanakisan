
import { useState } from 'react';
import {
  BS_MONTHS,
  BS_MONTHS_EN,
  BS_DAYS,
  getDaysInBSMonth,
  adToBs,
  bsToAd,
  nepaliDigits
}from '../utils/bsCalendarUtils'


 export function BSCalendar({ selectedBs, onSelect, eventDates, holidayMap }) {
  const [viewYear, setViewYear] = useState(selectedBs.year);
  const [viewMonth, setViewMonth] = useState(selectedBs.month);

  const daysInMonth = getDaysInBSMonth(viewYear, viewMonth);
  const startDow = bsToAd(viewYear, viewMonth, 1).getDay();

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const hasEvent = (day) =>
    day && eventDates.some(ed => ed.year === viewYear && ed.month === viewMonth && ed.day === day);

  const isSelected = (day) =>
    day && selectedBs.year === viewYear && selectedBs.month === viewMonth && selectedBs.day === day;

  const isToday = (day) => {
    if (!day) return false;
    const t = adToBs(new Date());
    return t.year === viewYear && t.month === viewMonth && t.day === day;
  };

  const isSaturday = (day) => {
    if (!day) return false;
    const adDate = bsToAd(viewYear, viewMonth, day);
    return adDate.getDay() === 6;
  };

  // Check if a day is a holiday
  const isHoliday = (day) => {
    if (!day) return false;
    const key = `${viewYear}-${viewMonth}-${day}`;
    return holidayMap?.has(key);
  };

  const firstAd = bsToAd(viewYear, viewMonth, 1);
  const lastAd = bsToAd(viewYear, viewMonth, daysInMonth);
  const adSubtitle =
    firstAd.getMonth() === lastAd.getMonth()
      ? firstAd.toLocaleString("en", { month: "long", year: "numeric" })
      : `${firstAd.toLocaleString("en", { month: "short" })}–${lastAd.toLocaleString("en", { month: "short", year: "numeric" })}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-primary-100 overflow-hidden">
      {/* Header */}
      <div className="bg-primary-700 text-white px-4 py-3 flex items-center justify-between">
        <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary-600 transition-colors text-xl font-bold">‹</button>
        <div className="text-center">
          <div className="font-bold text-base">{BS_MONTHS[viewMonth]} {nepaliDigits(viewYear)}</div>
          <div className="text-xs text-primary-200 mt-0.5">{BS_MONTHS_EN[viewMonth]} {viewYear} BS · {adSubtitle}</div>
        </div>
        <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary-600 transition-colors text-xl font-bold">›</button>
      </div>

      {/* Day headers - शनि in red */}
      <div className="grid grid-cols-7 bg-primary-50 border-b border-primary-100">
        {BS_DAYS.map((d, index) => (
          <div
            key={d}
            className={`text-center text-xs font-semibold py-2 ${index === 6 ? "text-red-600 font-bold" : "text-primary-500"
              }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 p-2 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;

          const adDay = bsToAd(viewYear, viewMonth, day).getDate();
          const selected = isSelected(day);
          const today = isToday(day);
          const saturday = isSaturday(day);
          const holiday = isHoliday(day);

          let dateClasses = "rounded-lg flex flex-col items-center justify-center py-1.5 transition-all ";
          if (selected) {
            dateClasses += "bg-primary-700 text-white shadow-md";
          } else if (today) {
            dateClasses += "bg-accent/10 text-accent border border-accent/40";
          } else if (holiday) {
            dateClasses += "text-red-600 font-bold hover:bg-red-50";
          } else if (saturday) {
            dateClasses += "text-red-600 hover:bg-red-50";
          } else {
            dateClasses += "hover:bg-primary-50 text-primary-800";
          }

          return (
            <button
              key={i}
              onClick={() => onSelect({ year: viewYear, month: viewMonth, day })}
              className={dateClasses}
            >
              <span className="text-sm font-semibold leading-none">{nepaliDigits(day)}</span>
              <span className={`text-[9px] mt-0.5 leading-none ${selected ? "text-primary-200" : holiday || saturday ? "text-red-400" : "text-gray-400"}`}>
                {adDay}
              </span>
              {hasEvent(day) && (
                <span className={`w-1 h-1 rounded-full mt-0.5 ${selected ? "bg-white" : "bg-accent"}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="px-4 pb-3 pt-2 flex items-center gap-4 text-xs text-gray-400 border-t border-gray-100">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent inline-block" /> Event</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent/30 border border-accent inline-block" /> Today</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Holiday</span>
        <span className="flex items-center gap-1.5 ml-auto opacity-70">Small number = AD date</span>
      </div>
    </div>
  );
}