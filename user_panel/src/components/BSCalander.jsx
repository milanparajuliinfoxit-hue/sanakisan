import { useState } from 'react';
import {
  BS_MONTHS,
  BS_MONTHS_EN,
  BS_DAYS,
  getDaysInBSMonth,
  adToBs,
  bsToAd,
  nepaliDigits
} from '../utils/bsCalendarUtils'

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
    <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-emerald-700 to-emerald-800 px-4 py-3 text-white">
        <button onClick={prevMonth} className="flex h-8 w-8 items-center justify-center rounded-lg text-xl font-bold transition-colors hover:bg-white/20">‹</button>
        <div className="text-center">
          <div className="font-bold text-base">{BS_MONTHS[viewMonth]} {nepaliDigits(viewYear)}</div>
          <div className="mt-0.5 text-xs text-emerald-200">{BS_MONTHS_EN[viewMonth]} {viewYear} BS · {adSubtitle}</div>
        </div>
        <button onClick={nextMonth} className="flex h-8 w-8 items-center justify-center rounded-lg text-xl font-bold transition-colors hover:bg-white/20">›</button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-emerald-100 bg-emerald-50">
        {BS_DAYS.map((d, index) => (
          <div
            key={d}
            className={`py-2 text-center text-xs font-semibold ${index === 6 ? "font-bold text-red-600" : "text-emerald-600"
              }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-0.5 p-2">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;

          const adDay = bsToAd(viewYear, viewMonth, day).getDate();
          const selected = isSelected(day);
          const today = isToday(day);
          const saturday = isSaturday(day);
          const holiday = isHoliday(day);

          let dateClasses = "flex flex-col items-center justify-center py-1.5 rounded-lg transition-all ";
          if (selected) {
            dateClasses += "bg-emerald-700 text-white shadow-md";
          } else if (today) {
            dateClasses += "bg-amber-50 text-amber-700 border border-amber-300";
          } else if (holiday) {
            dateClasses += "text-red-600 font-bold hover:bg-red-50";
          } else if (saturday) {
            dateClasses += "text-red-600 hover:bg-red-50";
          } else {
            dateClasses += "text-emerald-800 hover:bg-emerald-50";
          }

          return (
            <button
              key={i}
              onClick={() => onSelect({ year: viewYear, month: viewMonth, day })}
              className={dateClasses}
            >
              <span className="text-sm font-semibold leading-none">{nepaliDigits(day)}</span>
              <span className={`mt-0.5 text-[9px] leading-none ${selected ? "text-emerald-200" : holiday || saturday ? "text-red-400" : "text-gray-400"}`}>
                {adDay}
              </span>
              {hasEvent(day) && (
                <span className={`mt-0.5 h-1 w-1 rounded-full ${selected ? "bg-white" : "bg-amber-500"}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 border-t border-emerald-100 px-4 pb-3 pt-2 text-xs text-gray-400">
        <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-amber-500" /> Event</span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full border border-amber-500 bg-amber-50" /> Today</span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-red-500" /> Holiday</span>
        <span className="ml-auto opacity-70">Small number = AD date</span>
      </div>
    </div>
  );
}
